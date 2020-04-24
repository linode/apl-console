/* eslint-disable no-param-reassign */
import { entries, get, set, unset } from 'lodash/object'
import { find, map } from 'lodash/collection'
import { isEmpty, cloneDeep } from 'lodash/lang'

let spec: any

export function applyAclToUiSchema(uiSchema, schema: any, role: string): void {
  entries(schema.properties).forEach(([k, v]) => {
    if (!('x-acl' in v)) {
      // If there is no x-acl then field is rendered in read-write mode
      return
    }

    const path = `x-acl.${role}`
    const acl = get(v, path, [])
    const uiPath = `${k}.ui:readonly`

    set(uiSchema, uiPath, true)
    if (acl.includes('write')) {
      set(uiSchema, uiPath, false)
    }
  })
}

export function getTeamUiSchema(schema, role: string): any {
  const uiSchema = {
    teamId: { 'ui:widget': 'hidden' },
    password: { 'ui:widget': 'hidden' },
    clusters: {
      'ui:widget': 'checkboxes',
    },
    receiver: {
      'ui:widget': 'radio',
      // 'ui:title': ' ',
      'ui:options': {
        inline: true,
      },
      type: { 'ui:widget': 'hidden' },
    },
    azure: {
      monitor: { 'ui:widget': 'radio', useAdmin: { 'ui:widget': 'hidden' } },
    },
  }

  applyAclToUiSchema(uiSchema, schema, role)
  return uiSchema
}

export function getServiceUiSchema(schema, role: string, formData): any {
  const notAws = !get(formData, 'clusterId', '').startsWith('aws')
  const noCertArn = notAws || !formData || !formData.ingress || !formData.ingress.hasCert
  const uiSchema = {
    serviceName: { 'ui:widget': 'hidden', 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    serviceId: { 'ui:widget': 'hidden' },
    ingress: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
      internal: { 'ui:widget': 'hidden' },
      certArn: {
        'ui:widget': noCertArn ? 'hidden' : 'text',
        'ui:description': noCertArn ? ' ' : undefined,
      },
    },
    ksvc: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
      serviceType: { 'ui:widget': 'hidden' },
      autoCD: {
        'ui:widget': 'radio',
        tagMatcher: { 'ui:widget': 'hidden' },
      },
      env: { 'ui:options': { orderable: false }, annotations: { 'ui:options': { orderable: false } } },
    },
  }

  applyAclToUiSchema(uiSchema, schema, role)

  return uiSchema
}

export function setSpec(inSpec): void {
  spec = inSpec
}

function addDomainEnumField(schema, clusters, formData): void {
  if (!formData || !formData.clusterId || isEmpty(formData.ingress)) return
  const cluster = find(clusters, { id: formData.clusterId })
  schema.properties.ingress.oneOf[1].properties.domain.enum = cluster.dnsZones
  if (cluster.dnsZones.length === 1 || formData.ingress.useDefaultSubdomain)
    formData.ingress.domain = cluster.dnsZones[0]
}

function addClustersEnum(schema, team, formData): void {
  schema.properties.clusterId.enum = team.clusters
  if (team.clusters.length === 1) formData.clusterId = team.clusters[0]
}

function removeCertArnField(schema) {
  unset(schema, 'properties.ingress.oneOf[1].properties.certArn')
}
export function getServiceSchema(team: any, clusters: [any], formData: any): any {
  const schema = cloneDeep(spec.components.schemas.Service)

  addDomainEnumField(schema, clusters, formData)
  addClustersEnum(schema, team, formData)
  if (!get(formData, 'clusterId', '').startsWith('aws')) removeCertArnField(schema)
  return schema
}

export function getTeamSchema(clusters: [any]): any {
  const schema = { ...spec.components.schemas.Team }
  schema.properties.clusters.items.enum = map(clusters, 'id')
  return schema
}

export const getSpec = (): object => spec
