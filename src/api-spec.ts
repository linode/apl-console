/* eslint-disable no-param-reassign */
import { entries, get, set, unset } from 'lodash/object'
import { find, map } from 'lodash/collection'
import { isEmpty, cloneDeep } from 'lodash/lang'
import { Cluster } from '@redkubes/otomi-api-client-axios'
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
    clusters: {
      'ui:widget': 'checkboxes',
    },
    receiver: {
      'ui:widget': CustomRadioGroup,
      // 'ui:title': ' ',
      'ui:options': {
        inline: true,
      },
      type: { 'ui:widget': 'hidden' },
    },
    azure: {
      monitor: { 'ui:widget': CustomRadioGroup, useAdmin: { 'ui:widget': 'hidden' } },
    },
  }

  applyAclToUiSchema(uiSchema, schema, roles, crudMethod)
  return uiSchema
}

export function getServiceUiSchema(schema: Schema, roles: any, formData, crudMethod: string): any {
  const notAws = !get(formData, 'clusterId', '').startsWith('aws')
  const noCert = !formData || !formData.ingress || !formData.ingress.hasCert
  const noCertArn = notAws || noCert
  const uiSchema = {
    id: { 'ui:widget': 'hidden' },
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
      secrets: { 'ui:options': { orderable: false } },
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

function addDomainEnumField(schema: Schema, clusters: Cluster[], formData): void {
  if (!formData || !formData.clusterId || isEmpty(formData.ingress)) return
  const cluster = find(clusters, { id: formData.clusterId })
  schema.properties.ingress.oneOf[1].properties.domain.enum = cluster.dnsZones
  if (cluster.dnsZones.length === 1 || formData.ingress.useDefaultSubdomain)
    formData.ingress.domain = cluster.dnsZones[0]
}

function addClustersEnum(schema: Schema, team, formData): void {
  schema.properties.clusterId.enum = team.clusters
  if (formData && team.clusters.length === 1) formData.clusterId = team.clusters[0]
}

export function addNamespaceEnum(schema: Schema, namespaces): void {
  schema.properties.namespace.enum = namespaces
}

export function getServiceSchema(team: any, clusters, formData: any, secrets): any {
  const schema = cloneDeep(spec.components.schemas.Service)
  addDomainEnumField(schema, clusters, formData)
  addClustersEnum(schema, team, formData)

  if (!get(formData, 'ingress.hasCert', '')) {
    unset(schema, 'properties.ingress.oneOf[1].properties.certName')
    unset(schema, 'properties.ingress.oneOf[1].properties.certSelect')
  } else {
    const subdomain = get(formData, 'ingress.subdomain', '')
    const domain = get(formData, 'ingress.domain', '')
    if (formData.ingress.certSelect) {
      const tlsSecretNames = secrets.filter(s => s.type === 'tls').map(s => s.name)
      schema.properties.ingress.oneOf[1].properties.certName.enum = tlsSecretNames
      if (secrets.length === 1) formData.ingress.certName = Object.keys(secrets)[0]
    } else if (!formData.ingress.certSelect && formData.ingress.certName === undefined) {
      formData.ingress.certName = `${subdomain}.${domain}`.replace(/\./g, '-')
    }
  }
  if (get(formData, 'ksvc.secrets')) {
    const genSecrets = secrets.filter(s => s.type === 'generic')
    formData.ksvc.secrets.forEach((secret, idx) => {
      const selectedSecrets = [...Array(idx)].reduce((memo, curr, idy) => {
        memo.push(formData.ksvc.secrets[idy])
        return memo
      }, [])
      const secretsSelection = genSecrets.filter(s => !selectedSecrets.find(fs => fs.name === s.name))
      set(
        schema,
        'properties.ksvc.oneOf[0].properties.secrets.items.properties.name.enum',
        secretsSelection.map(s => s.name),
      )
      if (secret.name) {
        // debugger
        set(
          schema,
          'properties.ksvc.oneOf[0].properties.secrets.items.properties.entries.items.enum',
          secrets.find(s => s.name === secret.name).entries.map(s => s.key),
        )
      }
    })
  }
  return schema
}

export function getSecretSchema(): any {
  const schema = cloneDeep(spec.components.schemas.Secret)
  return schema
}

export function getTeamSchema(clusters): any {
  const schema = { ...spec.components.schemas.Team }
  schema.properties.clusters.items.enum = map(clusters, 'id')
  return schema
}

export function getSettingsSchema(): any {
  return spec.components.schemas.Settings
}
