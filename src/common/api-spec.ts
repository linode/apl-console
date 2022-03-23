import {
  Provider,
  SecretDockerRegistryTypeEnum,
  SecretTLSTypeEnum,
  Service,
  Settings,
  SvcPredeployedServiceTypeEnum,
  Team,
  User,
} from '@redkubes/otomi-api-client-axios'
import { pascalCase } from 'change-case'
import CodeEditor from 'components/rjsf/FieldTemplate/CodeEditor'
import { get, set, unset } from 'lodash'
import { cloneDeep, isEmpty } from 'lodash/lang'
import { extract, getStrict, isOf } from 'utils/schema'

const getIngressSchemaPath = (idx: number) => `properties.ingress.oneOf[${idx}].allOf[0].properties`

const idxMap = {
  private: 1,
  public: 2,
  tlsPass: 3,
}

const podSpecUiSchema = {
  files: { items: { content: { 'ui:widget': 'textarea' } } },
  secrets: {
    'ui:options': { addable: false, removable: false },
  },
}
const jobSpecUiSchema = {
  ...podSpecUiSchema,
  script: { 'ui:widget': 'textarea' },
}

export type AclAction =
  | 'create'
  | 'create-any'
  | 'delete'
  | 'delete-any'
  | 'read'
  | 'read-any'
  | 'update'
  | 'update-any'

export type SchemaType = 'object' | 'array'

export interface OpenApi {
  components: {
    schemas: {
      [schemaName: string]: Schema
    }
  }
}
export interface Schema {
  'x-acl'?: Acl
  type: SchemaType
  properties?: {
    [propertyName: string]: Property
  }
  items?: any
}

export interface Acl {
  team?: AclAction[]
  admin?: AclAction[]
}

export interface Property {
  type: string
  'x-acl'?: Acl
  oneOf?: any
  enum?: string[]
  items?: any
}

let spec: OpenApi

export const getSpec = () => spec

export const applyAclToUiSchema = (uiSchema: any, user: User, teamId: string, schemaName: string): void => {
  if (user.isAdmin) return

  get(user, `authz.${teamId}.deniedAttributes.${schemaName}`, []).forEach((path) => {
    set(uiSchema, `${path}.ui:readonly`, true)
  })
}

export const setSpec = (inSpec): void => {
  spec = inSpec
}

const addDomainEnumField = (schema: Schema, settings, formData): void => {
  const { cluster, dns } = settings
  if (['cluster', 'tlsPass'].includes(formData?.ingress?.type)) return
  const ing = formData?.ingress
  const idx = idxMap[formData?.ingress?.type]
  if (!formData || isEmpty(ing)) return
  const ingressSchemaPath = getIngressSchemaPath(idx)
  const ingressSchema = getStrict(schema, ingressSchemaPath)
  const zones = [cluster.domainSuffix, ...(dns?.zones || [])]
  if (zones.length === 1 || ing.useDefaultSubdomain) ing.domain = zones[0]
  if (!ingressSchema) return
  if (formData.ingress.domain) {
    const { length } = formData.ingress.domain
    set(ingressSchema, 'subdomain.maxLength', 64 - length)
  }
  set(ingressSchema, 'domain.enum', zones)
}

export const getJobSchema = (settings: Settings, formData: any, secrets: Array<any>): any => {
  const schema: Schema = cloneDeep(spec.components.schemas.Job)
  const jobSpecPath = 'allOf[1].properties'
  const containerSpecPath = 'allOf[2].allOf[2].allOf[1].properties'
  const initcontainerSpecPath = 'allOf[1].properties.init.items.allOf[1].properties'
  unset(schema, `${containerSpecPath}.command`)
  unset(schema, `${containerSpecPath}.args`)
  unset(schema, `${initcontainerSpecPath}.command`)
  unset(schema, `${initcontainerSpecPath}.args`)
  if (formData.type === 'Job') unset(schema, `${jobSpecPath}.schedule`)

  // set the Secrets enum with items to choose from
  setSecretsEnum(get(schema, initcontainerSpecPath), secrets)
  setSecretsEnum(get(schema, containerSpecPath), secrets)

  return schema
}

export const getJobUiSchema = (formData, user: User, teamId: string): any => {
  const uiSchema = {
    ...jobSpecUiSchema,
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    init: { 'ui:field': 'collapse', ...jobSpecUiSchema },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Job')

  return uiSchema
}

export const getServiceSchema = (
  appsEnabled: Record<string, any>,
  settings: Settings,
  formData,
  secrets: Array<any>,
): any => {
  const { cluster, otomi } = settings
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  const ksvcSchemaPath = 'properties.ksvc.oneOf[2].allOf[2].properties'
  addDomainEnumField(schema, settings, formData)
  const ing = formData?.ingress
  const idx = idxMap[formData?.ingress?.type]
  if (idx) {
    const ingressSchemaPath = getIngressSchemaPath(idx)
    const ingressSchema = getStrict(schema, ingressSchemaPath)

    if (ing?.tlsPass) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'hasCert')
      unset(ingressSchema, 'path')
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    }
    if (cluster.provider !== Provider.aws) unset(ingressSchema, `certArn`)

    if (!ing?.hasCert) {
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    } else if (ing) {
      // Give the certName an enum selector with names of existing tls secrets
      if (ing.certSelect) {
        const tlsSecretNames = secrets.filter((s) => s.secret.type === SecretTLSTypeEnum.tls).map((s) => s.name)
        set(ingressSchema, `certName.enum`, tlsSecretNames)
        if (secrets.length === 1) ing.certName = tlsSecretNames[0]
      }
    }
    if (['cluster', 'tlsPass'].includes(ing?.type)) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'path')
      unset(ingressSchema, 'hasCert')
    }
  }
  if (!appsEnabled.knative) schema.properties.ksvc.oneOf.splice(2)
  // set the Secrets enum with items to choose from
  else setSecretsEnum(get(schema, ksvcSchemaPath), secrets)

  return schema
}

export const getServiceUiSchema = (
  appsEnabled: Record<string, any>,
  { otomi }: Settings,
  formData: Service,
  user: User,
  teamId: string,
): any => {
  const ing = formData?.ingress as any
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      domain: { 'ui:readonly': ing?.useDefaultSubdomain },
      subdomain: { 'ui:readonly': ing?.useDefaultSubdomain },
      // @ts-ignore
      certArn: { 'ui:readonly': formData.ingress?.certSelect },
      tlsPass: { 'ui:readonly': formData.ksvc?.serviceType !== SvcPredeployedServiceTypeEnum.svcPredeployed },
    },
    ksvc: {
      ...podSpecUiSchema,
    },
  }
  // TODO: Not working yet, see bug: https://github.com/rjsf-team/react-jsonschema-form/issues/2776
  // So we remove the item from the schema instead (see getServiceSchema above)
  // if (!appsEnabled.alertmanager || !otomi.isMultitenant) uiSchema.ksvc = { 'ui:enumDisabled': [2] }

  applyAclToUiSchema(uiSchema, user, teamId, 'Service')

  return uiSchema
}

export const getTeamSchema = (appsEnabled: Record<string, any>, settings: Settings, team: Team): any => {
  const {
    cluster: { provider },
    otomi,
  } = settings
  const schema = cloneDeep(spec.components.schemas.Team)
  // no drone alerts for teams (yet)
  unset(schema, 'properties.alerts.properties.drone')
  deleteAlertEndpoints(schema.properties.alerts, team?.alerts)
  if (provider !== Provider.azure) unset(schema, 'properties.azureMonitor')
  return schema
}

export const getTeamUiSchema = (
  appsEnabled: Record<string, any>,
  { otomi }: Settings,
  user: User,
  teamId: string,
  action: string,
): any => {
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': action !== 'create' },
    password: { 'ui:widget': 'hidden' },
    alerts: {
      receivers: {
        type: { 'ui:widget': 'hidden' },
      },
    },
  }
  if (!appsEnabled.alertmanager || !otomi.isMultitenant) {
    uiSchema.alerts['ui:title'] = 'Alerts (disabled)'
    uiSchema.alerts['ui:disabled'] = true
    uiSchema.selfService = { Team: { 'ui:enumDisabled': ['alerts'] } }
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Team')
  return uiSchema
}

export const deleteAlertEndpoints = (schema, formData) => {
  schema.properties.receivers.items.enum.forEach((receiver) => {
    if (!(formData?.receivers || []).includes(receiver) && !(formData?.drone || []).includes(receiver))
      delete schema.properties[receiver]
  })
}

export const getSettingSchema = (settingId, settings: Settings, formData: any): any => {
  const schema = cloneDeep(spec.components.schemas.Settings.properties[settingId])
  const {
    cluster: { provider },
  } = settings
  switch (settingId) {
    case 'home':
      deleteAlertEndpoints(schema, formData)
      break
    case 'alerts':
      deleteAlertEndpoints(schema, formData)
      break
    case 'azure':
      if (provider !== Provider.azure) unset(schema, 'properties.azure')
      break
    case 'dns':
      if (formData.provider?.azure?.useManagedIdentityExtension) {
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.aadClientId')
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.aadClientSecret')
      } else {
        unset(schema, 'properties.provider.oneOf[2].properties.azure.properties.userAssignedIdentityID')
        set(schema, 'properties.provider.oneOf[2].properties.azure.required', ['aadClientId', 'aadClientSecret'])
      }
      break
    case 'oidc':
      break
    default:
      break
  }
  return schema
}

export const getSettingUiSchema = (settings: Settings, settingId: string, user: User, teamId: string): any => {
  const uiSchema = {
    kms: {
      sops: {
        provider: { 'ui:widget': 'hidden' },
        google: {
          accountJson: { 'ui:widget': 'textarea' },
        },
      },
    },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'Settings')

  return uiSchema[settingId] || {}
}

export const setSecretsEnum = (schema, secrets) => {
  if (secrets.length) {
    const secretNames = secrets
      .filter((s) => s.secret.type !== SecretDockerRegistryTypeEnum.docker_registry)
      .map((s) => s.name)
    set(schema, `secrets.items.enum`, secretNames)
    set(schema, `secretMounts.items.properties.name.enum`, secretNames)
  } else {
    set(schema, `secrets.items.readOnly`, true)
    set(schema, `secretMounts.items.readOnly`, true)
  }
}

export const getSecretSchema = (): any => {
  const schema = cloneDeep(spec.components.schemas.Secret)
  return schema
}

export const getSecretUiSchema = (user: User, teamId: string): any => {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Secret')

  return uiSchema
}

export const getPolicySchema = (policyId): any => {
  const schema = cloneDeep(get(spec, `components.schemas.Settings.properties.policies.properties[${policyId}]`))
  switch (policyId) {
    default:
      break
  }
  return schema
}

export const getPolicyUiSchema = (settingId: string, user: User, teamId: string): any => {
  const uiSchema = {}
  applyAclToUiSchema(uiSchema, user, teamId, 'Settings')

  return uiSchema[settingId] || {}
}

export const getAppSchema = (appId): any => {
  const modelName = `App${pascalCase(appId)}`
  const schema = cloneDeep(spec.components.schemas[modelName])
  switch (appId) {
    default:
      break
  }
  return schema
}

export const getAppUiSchema = (appId, formData): any => {
  const modelName = `App${pascalCase(appId)}`
  const model = spec.components.schemas[modelName].properties.values
  const uiSchema = {}
  if (model) {
    const leafs = Object.keys(extract(model, (o) => o.type === 'object' && !o.properties && !isOf(o) && !o.nullable))
    leafs.forEach((path) => {
      set(uiSchema, path, { 'ui:FieldTemplate': CodeEditor })
    })
  }
  switch (appId) {
    case 'drone':
      const provider = get(formData, 'sourceControl.provider')
      if (provider !== 'github') set(uiSchema, 'githubAdmins.ui:widget', 'hidden')
      break
    default:
      break
  }
  return uiSchema
}
