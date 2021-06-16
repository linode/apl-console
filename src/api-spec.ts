/* eslint-disable no-param-reassign */
import { get, set, unset } from 'lodash/object'
import { isEmpty, cloneDeep } from 'lodash/lang'
import { User } from '@redkubes/otomi-api-client-axios'
import CustomRadioGroup from './components/rjsf/RadioGroup'

const ingressPublicSchemaPath = 'properties.ingress.oneOf[2].properties.public.properties'
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
    azureMonitor: { 'ui:widget': CustomRadioGroup },
    selfService: {
      Team: { 'ui:title': 'Team', 'ui:widget': 'checkboxes' },
      Service: { 'ui:title': 'Service', 'ui:widget': 'checkboxes' },
    },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Team')
  return uiSchema
}

export function getServiceUiSchema(formData, cloudProvider: string, user: User, teamId: string, action: string): any {
  const notAws = cloudProvider !== 'aws'
  const noCert = !formData?.ingress?.public?.hasCert
  const noCertArn = notAws || noCert
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    enabled: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true, 'ui:readonly': action !== 'create' },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      'ui:widget': CustomRadioGroup,
      'ui:options': {
        inline: true,
      },
      public: {
        internal: { 'ui:widget': 'hidden' },
        certArn: {
          'ui:widget': noCertArn ? 'hidden' : undefined,
        },
        certName: {
          'ui:widget': noCert ? 'hidden' : undefined,
        },
        certSelect: {
          'ui:widget': noCert ? 'hidden' : undefined,
        },
      },
    },
    ksvc: {
      'ui:widget': CustomRadioGroup,
      'ui:options': { inline: true },
      serviceType: { 'ui:widget': 'hidden' },
      autoCD: {
        'ui:widget': CustomRadioGroup,
        'ui:options': { inline: true },
        tagMatcher: { 'ui:widget': 'hidden' },
      },
      env: { 'ui:options': { orderable: false } },
      annotations: { 'ui:options': { orderable: false } },
      secrets: {
        // 'ui:widget': 'checkboxes',
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
    name: { 'ui:autofocus': true, 'ui:readonly': action !== 'create' },
    teamId: { 'ui:widget': 'hidden' },
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

function addDomainEnumField(schema: Schema, dns: any, formData): void {
  const ingressPublicData = formData?.ingress?.public

  if (!formData || isEmpty(ingressPublicData)) return
  const ingressPublicSchema = get(schema, ingressPublicSchemaPath)
  ingressPublicSchema.domain.enum = dns.dnsZones
  if (dns.dnsZones.length === 1 || ingressPublicData.useDefaultSubdomain) ingressPublicData.domain = dns.dnsZones[0]
  ingressPublicSchema.domain.readOnly = ingressPublicData.useDefaultSubdomain
  ingressPublicSchema.subdomain.readOnly = ingressPublicData.useDefaultSubdomain
}

export function addNamespaceEnum(schema: Schema, namespaces): void {
  schema.properties.namespace.enum = namespaces
}

export function getServiceSchema(dns, formData: any, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  addDomainEnumField(schema, dns, formData)
  const ingressPublicData = get(formData, 'ingress.public', {})

  if (!ingressPublicData.hasCert) {
    unset(schema, `${ingressPublicSchemaPath}.certName`)
    unset(schema, `${ingressPublicSchemaPath}.certSelect`)
  } else {
    const subdomain = get(formData, 'ingress.public.subdomain', '')
    const domain = get(formData, 'ingress.public.domain', '')

    if (ingressPublicData.certSelect) {
      const tlsSecretNames = secrets.filter((s) => s.type === 'tls').map((s) => s.name)
      set(schema, `${ingressPublicSchemaPath}.certName.enum`, tlsSecretNames)
      if (secrets.length === 1) ingressPublicData.certName = Object.keys(secrets)[0]
    } else if (!ingressPublicData.certSelect && ingressPublicData.certName === undefined) {
      ingressPublicData.certName = `${subdomain}.${domain}`.replace(/\./g, '-')
    }
  }
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.type === 'generic').map((s) => s.name)
    schema.properties.ksvc.oneOf[0].properties.secrets.items.enum = secretNames
  } else {
    schema.properties.ksvc.oneOf[0].properties.secrets.items.enum = undefined
    schema.properties.ksvc.oneOf[0].properties.secrets.readOnly = true
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

export function getSettingsUiSchema() {
  return {}
}
