/* eslint-disable no-param-reassign */
import { isEmpty, cloneDeep } from 'lodash/lang'
import {
  Cluster,
  Provider,
  SecretDockerRegistry,
  SecretGeneric,
  SecretTLS,
  Service,
  SvcPredeployed,
  User,
} from '@redkubes/otomi-api-client-axios'
import { get, set, unset } from 'lodash'
import { getStrict } from './utils'

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

export function applyAclToUiSchema(uiSchema: any, user: User, teamId: string, schemaName: string): void {
  if (user.isAdmin) return

  get(user, `authz.${teamId}.deniedAttributes.${schemaName}`, []).forEach((path) => {
    set(uiSchema, `${path}.ui:readonly`, true)
  })
}

export function getTeamUiSchema(user: User, teamId: string, action: string): any {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': action !== 'create' },
    password: { 'ui:widget': 'hidden' },
    alerts: {
      receivers: {
        type: { 'ui:widget': 'hidden' },
      },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Team')
  return uiSchema
}

export function getJobUiSchema(formData, user: User, teamId: string): any {
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

export function getServiceUiSchema(formData: Service, user: User, teamId: string): any {
  const ing = formData?.ingress as any
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    enabled: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      type: { 'ui:widget': 'hidden' },
      domain: { 'ui:readonly': ing?.useDefaultSubdomain },
      subdomain: { 'ui:readonly': ing?.useDefaultSubdomain },
      // @ts-ignore
      certArn: { 'ui:readonly': formData.ingress?.certSelect },
      tlsPass: { 'ui:readonly': formData.ksvc?.serviceType !== SvcPredeployed.ServiceTypeEnum.svcPredeployed },
    },
    ksvc: {
      ...podSpecUiSchema,
      serviceType: { 'ui:widget': 'hidden' },
      autoCD: {
        tagMatcher: { 'ui:widget': 'hidden' },
      },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Service')

  return uiSchema
}

export function getSecretUiSchema(user: User, teamId: string): any {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    secret: {
      'ui:description': undefined,
      dockerconfig: { 'ui:widget': 'hidden', 'ui:description': undefined },
      type: { 'ui:widget': 'hidden' },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Secret')

  return uiSchema
}

export function setSpec(inSpec): void {
  spec = inSpec
}

function addDomainEnumField(schema: Schema, cluster, dns, formData): void {
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
    const length = formData.ingress.domain.length
    set(ingressSchema, 'subdomain.maxLength', 64 - length)
  }
  set(ingressSchema, 'domain.enum', zones)
}

export function getJobSchema(cluster: Cluster, dns: any, formData: any, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Job)
  const jobSpecPath = 'allOf[1].properties'
  const containerSpecPath = 'allOf[2].allOf[2].allOf[1].properties'
  const initcontainerSpecPath = 'allOf[1].properties.init.items.properties'
  unset(schema, `${containerSpecPath}.command`)
  unset(schema, `${containerSpecPath}.args`)
  unset(schema, `${initcontainerSpecPath}.command`)
  unset(schema, `${initcontainerSpecPath}.args`)
  if (formData.type === 'Job') {
    unset(schema, `${jobSpecPath}.schedule`)
  }
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.secret.type === SecretGeneric.TypeEnum.generic).map((s) => s.name)
    set(schema, `${initcontainerSpecPath}.secrets.items.enum`, secretNames)
    set(schema, `${containerSpecPath}.secrets.items.enum`, secretNames)
  } else {
    unset(schema, `${initcontainerSpecPath}.secrets.items.enum`)
    unset(schema, `${containerSpecPath}.secrets.items.enum`)
    set(schema, `${initcontainerSpecPath}.secrets.readOnly`, true)
    set(schema, `${containerSpecPath}.secrets.secrets.readOnly`, true)
  }
  return schema
}

export function getServiceSchema(cluster: Cluster, dns, formData, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  const ksvcSchemaPath = 'properties.ksvc.oneOf[2].allOf[2].properties'
  addDomainEnumField(schema, cluster, dns, formData)
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
    if (cluster.provider !== Provider.aws) {
      unset(ingressSchema, `certArn`)
    }
    if (!ing?.hasCert) {
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    } else if (ing) {
      // Give the certName an enum selector with names of existing tls secrets
      if (ing.certSelect) {
        const tlsSecretNames = secrets.filter((s) => s.secret.type === SecretTLS.TypeEnum.tls).map((s) => s.name)
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
  // set the Secrets enum with items to choose from
  if (secrets.length) {
    const secretNames = secrets
      .filter((s) => s.secret.type !== SecretDockerRegistry.TypeEnum.docker_registry)
      .map((s) => s.name)
    set(schema, `${ksvcSchemaPath}.secrets.items.enum`, secretNames)
    set(schema, `${ksvcSchemaPath}.secretMounts.items.properties.name.enum`, secretNames)
  } else {
    set(schema, `${ksvcSchemaPath}.secrets.items.readOnly`, true)
    set(schema, `${ksvcSchemaPath}.secretMounts.items.readOnly`, true)
  }

  return schema
}

export function getSecretSchema(): any {
  const schema = cloneDeep(spec.components.schemas.Secret)
  return schema
}

export function getTeamSchema(team, cluster: Cluster): any {
  const schema = cloneDeep(spec.components.schemas.Team)
  const provider = cluster.provider
  if (provider !== Provider.azure) unset(schema, 'properties.azureMonitor')

  schema.properties.alerts.properties.receivers.items.enum.forEach((receiver) => {
    if (team && (!team.alerts || !(team.alerts.receivers || []).includes(receiver))) {
      delete schema.properties.alerts.properties[receiver]
    }
  })
  unset(schema, 'properties.alerts.properties.drone')
  return schema
}

export function getTeamSelfServiceSchema(): any {
  return spec.components.schemas.TeamSelfService
}

function deleteAlertEndpoints(schema, formData) {
  schema.properties.receivers.items.enum.forEach((receiver) => {
    if (!(formData.receivers || []).includes(receiver) && !(formData.drone === receiver)) {
      delete schema.properties[receiver]
    }
  })
}
export function getSettingSchema(settingId, cluster: Cluster, formData: any): any {
  const schema = cloneDeep(spec.components.schemas.Settings.properties[settingId])
  const provider = cluster.provider
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
        unset(schema, 'properties.provider.oneOf[1].properties.azure.properties.aadClientId')
        unset(schema, 'properties.provider.oneOf[1].properties.azure.properties.aadClientSecret')
      } else {
        unset(schema, 'properties.provider.oneOf[1].properties.azure.properties.userAssignedIdentityID')
        set(schema, 'properties.provider.oneOf[1].properties.azure.required', ['aadClientId', 'aadClientSecret'])
      }
      break
    case 'oidc':
      break
    default:
      break
  }
  return schema
}

export function getSettingUiSchema(settingId: string, user: User, teamId: string): any {
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
