/* eslint-disable no-param-reassign */
import { isEmpty, cloneDeep } from 'lodash/lang'
import {
  Cluster,
  Provider,
  SecretDockerRegistry,
  SecretGeneric,
  SecretTLS,
  Service,
  User,
} from '@redkubes/otomi-api-client-axios'
import { get, set, unset } from 'lodash'
import { JSONSchema4 } from 'json-schema'
import { getStrict } from './utils'

const ksvcSchemaPath = 'properties.ksvc.oneOf[2].allOf[0].allOf[1].properties'
const jobSpecUiSchemaPath = 'allOf[0].properties'
const jobInitSpecSecretsPath = 'allOf[0].properties.init.properties.secrets'
const jobSpecSecretsPath = 'allOf[1].allOf[1].properties.secrets'

const getIngressSchemaPath = (idx: number) => `properties.ingress.oneOf[${idx}].allOf[0].properties`
const idxMap = {
  private: 1,
  public: 2,
  tlsPass: 3,
}

const podSpecUiSchema = {
  annotations: { 'ui:options': { orderable: false } },
  env: { 'ui:options': { orderable: false } },
  files: { 'ui:options': { orderable: false }, items: { content: { 'ui:widget': 'textarea' } } },
  podSecurityContext: { 'ui:widget': 'hidden' },
  securityContext: { 'ui:widget': 'hidden' },
  secrets: {
    'ui:options': { orderable: false, addable: false, removable: false },
  },
  secretMounts: {
    'ui:options': { orderable: false },
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
export interface Acl {
  team?: AclAction[]
  admin?: AclAction[]
}
export interface Schema extends JSONSchema4 {
  'x-acl'?: Acl
  'x-readOnly'?: Acl
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
      certArn: {
        // @ts-ignore
        'ui:readonly': formData.ingress?.certSelect,
      },
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
      ca: { 'ui:widget': 'textarea' },
      crt: { 'ui:widget': 'textarea' },
      key: { 'ui:widget': 'textarea' },
      entries: { 'ui:options': { orderable: false } },
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
  const zones = [cluster.domainSuffix, ...(dns.zones || [])]
  if (zones.length === 1 || ing.useDefaultSubdomain) ing.domain = zones[0]
  if (!ingressSchema) return
  set(ingressSchema, 'domain.enum', zones)
}

export function getJobSchema(cluster: Cluster, dns: any, formData: any, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Job)
  if (formData.type === 'Job') {
    unset(schema, `${jobSpecUiSchemaPath}.schedule`)
  }
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.type === SecretGeneric.TypeEnum.generic).map((s) => s.name)
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

export function getServiceSchema(cluster: Cluster, dns, formData, secrets: Array<any>): any {
  const schema: Schema = cloneDeep(spec.components.schemas.Service)
  // since we ask for podSecurityContext and have only one container we don't offer container.securityContext:
  unset(schema, `properties.ksvc.oneOf[2].allOf[0].allOf[0].properties.securityContext`)
  // and we also disable podSecurityContext for now since it's only available from knative 1.21
  unset(schema, `properties.ksvc.oneOf[2].allOf[0].allOf[0].properties.podSecurityContext`)
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
        if (secrets.length === 1) ing.certName = Object.keys(secrets)[0]
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

export function getSettingSchema(settingId, cluster: Cluster): any {
  const schema = cloneDeep(spec.components.schemas.Settings.properties[settingId])
  const provider = cluster.provider
  if (provider !== Provider.azure) unset(schema, 'properties.azure')
  return schema
}

export function getSettingUiSchema(user: User, teamId: string, schema: any): any {
  const uiSchema = {}
  Object.entries(schema.properties).forEach(([propertyName, o]) => {
    if (o['x-readOnly']) Object.assign(uiSchema, { [propertyName]: { 'ui:readonly': true } })
  })
  applyAclToUiSchema(uiSchema, user, teamId, 'Settings')
  return uiSchema
}
