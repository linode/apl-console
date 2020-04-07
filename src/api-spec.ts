/* eslint-disable no-param-reassign */
import { entries, get, set } from 'lodash/object'

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

export function getServiceSchema(clusters: [string]): any {
  const schema = { ...spec.components.schemas.Service }

  // TODO: provide domain zones available for the cluster
  const domains = ['a.com', 'b.com', 'c.com']
  schema.properties.ingress.anyOf[1].properties.domain.enum = domains
  schema.properties.clusterId.enum = clusters
  // applyAclToSchema(schema, role)
  return schema
}

export function getTeamSchema(clusters: [string]): any {
  const schema = { ...spec.components.schemas.Team }
  schema.properties.clusters.items.enum = clusters
  return schema
}

export const getSpec = (): object => spec
