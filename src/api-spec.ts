/* eslint-disable no-param-reassign */
import { entries, get, set, unset } from 'lodash/object'
import { isEmpty, cloneDeep } from 'lodash/lang'
import CustomRadioGroup from './components/rjsf/RadioGroup'

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
  title?: string
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

export function applyAclToUiSchema(uiSchema: any, schema: Schema, roles: any, crudOperation: string): void {
  const role = ['team', 'admin'].reduce((role, _role) => {
    if ((roles as string[]).includes(_role)) role = _role
    return role
  })
  const path = `x-acl.${role}`
  entries(schema.properties).forEach(([k, v]) => {
    if (!('x-acl' in v)) {
      // If there is no x-acl then field is rendered in read-write mode
      return
    }
    const acl: string[] = get(v, path, [])
    if (acl.length === 0) {
      set(uiSchema, `${k}.ui:widget`, 'hidden')
    } else {
      set(uiSchema, `${k}.ui:readonly`, !acl.includes(crudOperation))
    }
  })
}

export function getTeamUiSchema(schema: Schema, roles: any, crudMethod: string): any {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
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
  }

  applyAclToUiSchema(uiSchema, schema, roles, crudMethod)
  return uiSchema
}

export function getServiceUiSchema(
  schema: Schema,
  roles: any,
  formData,
  crudMethod: string,
  cloudProvider: string,
): any {
  const notAws = cloudProvider !== 'aws'
  const noCert = !formData || !formData.ingress || !formData.ingress.hasCert
  const noCertArn = notAws || noCert
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    enabled: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      'ui:widget': CustomRadioGroup,
      'ui:options': {
        inline: true,
      },
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
    ksvc: {
      'ui:widget': CustomRadioGroup,
      'ui:options': {
        inline: true,
      },
      serviceType: { 'ui:widget': 'hidden' },
      autoCD: {
        'ui:widget': CustomRadioGroup,
        tagMatcher: { 'ui:widget': 'hidden' },
      },
      env: { 'ui:options': { orderable: false } },
      // secrets: {
      //   'ui:widget': 'checkboxes',
      // },
      annotations: { 'ui:options': { orderable: false } },
    },
  }

  applyAclToUiSchema(uiSchema, schema, roles, crudMethod)

  return uiSchema
}

export function getSecretUiSchema(schema: Schema, roles: Array<string>, crudMethod: string): any {
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    type: { 'ui:widget': 'hidden', description: undefined },
    ca: { 'ui:widget': 'textarea' },
    crt: { 'ui:widget': 'textarea' },
    key: { 'ui:widget': 'textarea' },
    entries: { 'ui:options': { orderable: false } },
  }

  applyAclToUiSchema(uiSchema, schema, roles, crudMethod)

  return uiSchema
}

export function setSpec(inSpec): void {
  spec = inSpec
}

function addDomainEnumField(schema: Schema, dns: any, formData): void {
  if (!formData || isEmpty(formData.ingress)) return
  schema.properties.ingress.oneOf[1].properties.domain.enum = dns.dnsZones
  if (dns.dnsZones.length === 1 || formData.ingress.useDefaultSubdomain) formData.ingress.domain = dns.dnsZones[0]
  schema.properties.ingress.oneOf[1].properties.domain.readOnly = formData.ingress.useDefaultSubdomain
  schema.properties.ingress.oneOf[1].properties.subdomain.readOnly = formData.ingress.useDefaultSubdomain
}

export function addNamespaceEnum(schema: Schema, namespaces): void {
  schema.properties.namespace.enum = namespaces
}

export function getServiceSchema(dns, formData: any, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  addDomainEnumField(schema, dns, formData)

  if (!get(formData, 'ingress.hasCert', '')) {
    unset(schema, 'properties.ingress.oneOf[1].properties.certName')
    unset(schema, 'properties.ingress.oneOf[1].properties.certSelect')
  } else {
    const subdomain = get(formData, 'ingress.subdomain', '')
    const domain = get(formData, 'ingress.domain', '')
    if (formData.ingress.certSelect) {
      const tlsSecretNames = secrets.filter((s) => s.type === 'tls').map((s) => s.name)
      schema.properties.ingress.oneOf[1].properties.certName.enum = tlsSecretNames
      if (secrets.length === 1) formData.ingress.certName = Object.keys(secrets)[0]
    } else if (!formData.ingress.certSelect && formData.ingress.certName === undefined) {
      formData.ingress.certName = `${subdomain}.${domain}`.replace(/\./g, '-')
    }
  }

  if (secrets.length) {
    const sec = {}
    secrets.forEach((s) => {
      if (s.type !== 'generic') return
      sec[s.name] = {
        type: 'array',
        title: s.name,
        items: {
          type: 'string',
          enum: s.entries,
        },
        uniqueItems: true,
      }
    })
    schema.properties.ksvc.oneOf[0].properties.secrets = {
      type: 'object',
      properties: sec,
    }
  } else {
    schema.properties.ksvc.oneOf[0].properties.secrets = {
      properties: {
        empty: {
          type: 'null',
          description: 'No applicable secrets',
        },
      },
    }
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

export function getSettingsSchema(idx?: string): any {
  const schema = cloneDeep(spec.components.schemas.Settings)
  return idx ? schema.properties[idx] : schema
}
