/* eslint-disable no-param-reassign */
import { get, set, unset } from 'lodash/object'
import { isEmpty, cloneDeep } from 'lodash/lang'
import { Service, User } from '@redkubes/otomi-api-client-axios'
import CustomRadioGroup from './components/rjsf/RadioGroup'

const ksvcSchemaPath = 'properties.ksvc.oneOf[2].allOf[1].properties'
const jobSpecSchemaPath = 'allOf[0].properties'
const jobInitSpecSecretsPath = 'allOf[0].properties.init.properties.secrets'
const jobSpecSecretsPath = 'allOf[1].allOf[1].properties.secrets'

const getIngressSchemaPath = (idx) => `properties.ingress.oneOf[${idx}].allOf[0].properties`
const idxMap = {
  private: 1,
  public: 2,
  tlsPass: 3,
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
        'ui:widget': 'checkboxes',
        // 'ui:title': ' ',
        'ui:options': {
          inline: true,
        },
        type: { 'ui:widget': 'hidden' },
      },
    },
    azureMonitor: {
      'ui:widget': CustomRadioGroup,
      'ui:options': {
        inline: true,
      },
    },
    selfService: {
      Team: { 'ui:title': 'Team', 'ui:widget': 'checkboxes' },
      Service: { 'ui:title': 'Service', 'ui:widget': 'checkboxes' },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Team')
  return uiSchema
}

export function getJobUiSchema(formData, cloudProvider: string, user: User, teamId: string, action: string): any {
  const secretsSchema = {
    secrets: {
      'ui:options': { orderable: false, addable: false, removable: false },
    },
  }
  const containerSpecSchema = {
    files: { 'ui:options': { orderable: false }, items: { value: { 'ui:widget': 'textarea' } } },
    script: { 'ui:widget': 'textarea' },
  }

  const uiSchema = {
    ...containerSpecSchema,
    ...secretsSchema,
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    init: { ...containerSpecSchema, ...secretsSchema },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Job')

  return uiSchema
}

export function getServiceUiSchema(
  formData: Service,
  cloudProvider: string,
  user: User,
  teamId: string,
  action: string,
): any {
  const notAws = cloudProvider !== 'aws'
  const ing = formData?.ingress as any
  const noCert = ing && !ing.hasCert
  const noCertArn = notAws || noCert
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    enabled: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      'ui:title': '',
      'ui:widget': CustomRadioGroup,
      certArn: {
        'ui:widget': noCertArn ? 'hidden' : undefined,
      },
      certName: {
        'ui:widget': noCert ? 'hidden' : undefined,
      },
      certSelect: {
        'ui:widget': noCert ? 'hidden' : undefined,
        description: noCert ? '' : undefined,
      },
      type: { 'ui:widget': 'hidden' },
      domain: { 'ui:readonly': ing?.useDefaultSubdomain },
      subdomain: { 'ui:readonly': ing?.useDefaultSubdomain },
    },
    ksvc: {
      'ui:widget': CustomRadioGroup,
      serviceType: { 'ui:widget': 'hidden' },
      autoCD: {
        'ui:widget': CustomRadioGroup,
        tagMatcher: { 'ui:widget': 'hidden' },
      },
      env: { 'ui:options': { orderable: false } },
      annotations: { 'ui:options': { orderable: false } },
      files: { 'ui:options': { orderable: false }, items: { value: { 'ui:widget': 'textarea' } } },
      secrets: {
        'ui:options': { orderable: false, addable: false, removable: false },
      },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Service')

  return uiSchema
}

export function getSecretUiSchema(user: User, teamId: string, action: string): any {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    dockerconfig: { 'ui:widget': 'hidden', description: undefined },
    type: { 'ui:widget': 'hidden', description: undefined },
    ca: { 'ui:widget': 'textarea' },
    crt: { 'ui:widget': 'textarea' },
    key: { 'ui:widget': 'textarea' },
    entries: { 'ui:options': { orderable: false } },
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
  const ingressSchema = get(schema, ingressSchemaPath)
  const zones = [cluster.domainSuffix, ...(dns.zones || [])]
  if (zones.length === 1 || ing.useDefaultSubdomain) ing.domain = zones[0]
  if (!ingressSchema) return
  set(ingressSchema, 'domain.enum', zones)
}

export function addNamespaceEnum(schema: Schema, namespaces): void {
  schema.properties.namespace.enum = namespaces
}

export function getJobSchema(cluster, dns, formData, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Job)
  if (formData.type === 'Job') {
    unset(schema, `${jobSpecSchemaPath}.schedule`)
  }
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.type === 'generic').map((s) => s.name)
    set(schema, `${jobInitSpecSecretsPath}.items.enum`, secretNames)
    set(schema, `${jobSpecSecretsPath}.items.enum`, secretNames)
  } else {
    unset(schema, `${jobInitSpecSecretsPath}.items.enum`)
    unset(schema, `${jobSpecSecretsPath}.items.enum`)
    set(schema, `${jobInitSpecSecretsPath}.secrets.readOnly`, true)
    set(schema, `${jobSpecSecretsPath}.secrets.readOnly`, true)
  }
  return schema
}

export function getServiceSchema(cluster, dns, formData, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  unset(schema, `properties.ksvc.oneOf[2].allOf[0].allOf[1].properties.securityContext`)
  addDomainEnumField(schema, cluster, dns, formData)
  const ing = formData?.ingress
  const idx = idxMap[formData?.ingress?.type]
  const ingressSchemaPath = getIngressSchemaPath(idx)
  const ingressSchema = get(schema, ingressSchemaPath)

  if (!ing?.hasCert) {
    unset(ingressSchema, `certName`)
    unset(ingressSchema, `certSelect`)
  } else if (ing) {
    const subdomain = get(formData, 'ingress.subdomain', '')
    const domain = get(formData, 'ingress.domain', '')

    // Give the certName an enum selector with names of existing tls secrets
    if (ing.certSelect) {
      const tlsSecretNames = secrets.filter((s) => s.type === 'tls').map((s) => s.name)
      set(ingressSchema, `certName.enum`, tlsSecretNames)
      if (secrets.length === 1) ing.certName = Object.keys(secrets)[0]
    } else if (!ing.certSelect && ing.certName === undefined) {
      ing.certName = `${subdomain}.${domain}`.replace(/\./g, '-')
    }
  }
  // set the Secrets enum with items to choose from
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.type === 'generic').map((s) => s.name)
    set(schema, `${ksvcSchemaPath}.secrets.items.enum`, secretNames)
    set(schema, `${ksvcSchemaPath}.secretMounts.items.properties.name.enum`, secretNames)
  } else {
    unset(schema, `${ksvcSchemaPath}.secrets.items.enum`)
    unset(schema, `${ksvcSchemaPath}.secretMounts.items.properties.name.enum`)
    set(schema, `${ksvcSchemaPath}.secrets.items.readOnly`, true)
    set(schema, `${ksvcSchemaPath}.secretMounts.items.readOnly`, true)
  }
  // remove type 'Cluster' when not using ksvc
  // if (schema.properties && formData?.ksvc?.serviceType === 'svcPredeployed') {
  //   schema.properties.ingress.oneOf.splice(0, 1)
  // }
  if (['cluster', 'tlsPass'].includes(ing?.type)) {
    unset(ingressSchema, 'auth')
    unset(ingressSchema, 'forwardPath')
    unset(ingressSchema, 'path')
    unset(ingressSchema, 'hasCert')
  }

  return schema
}

export function getSecretSchema(): any {
  const schema = cloneDeep(spec.components.schemas.Secret)
  return schema
}

export function getTeamSchema(team): any {
  const schema = cloneDeep(spec.components.schemas.Team)
  schema.properties.alerts.properties.receivers.items.enum.forEach((receiver) => {
    if (team && (!team.alerts || !(team.alerts.receivers || []).includes(receiver))) {
      delete schema.properties.alerts.properties[receiver]
    }
  })
  return schema
}

export function getTeamSelfServiceSchema(): any {
  return spec.components.schemas.TeamSelfService
}

export function getSettingsSchema(): any {
  return spec.components.schemas.Settings
}
