/* eslint-disable no-param-reassign */
import { entries, get, set } from 'lodash/object'
import { find, map } from 'lodash/collection'
import { isEmpty } from 'lodash/lang'

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
  }

  applyAclToUiSchema(uiSchema, schema, role)
  return uiSchema
}

export function getServiceUiSchema(schema, role: string): any {
  const uiSchema = {
    serviceName: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    serviceId: { 'ui:widget': 'hidden' },
    ingress: {
      'ui:widget': 'radio',
      internal: { 'ui:widget': 'hidden' },
    },
    spec: {
      'ui:widget': 'radio',
      predeployed: { 'ui:widget': 'hidden' },
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
  schema.properties.ingress.anyOf[1].properties.domain.enum = [cluster.domain]
}

function addClustersEnum(schema, team): void {
  schema.properties.clusterId.enum = team.clusters
}

export function getServiceSchema(team: any, clusters: [any], formData: any): any {
  const schema = { ...spec.components.schemas.Service }

  addDomainEnumField(schema, clusters, formData)
  addClustersEnum(schema, team)
  return schema
}

export function getTeamSchema(clusters: [any]): any {
  const schema = { ...spec.components.schemas.Team }
  schema.properties.clusters.items.enum = map(clusters, 'id')
  return schema
}

export const getSpec = (): object => spec
