import { entries, get, set } from 'lodash/object'
function addEnumField(schema, clusters): any {
  schema.properties.clusters.items.enum = clusters
}

function addClusterEnumField(schema, clusters): any {
  schema.properties.clusterId.enum = clusters
}

function addDomainEnumField(schema, domains): any {
  schema.properties.ingress.anyOf[1].properties.domain.enum = domains
}

function applyAclToUiSchema(uiSchema, schema: any, role: string): void {
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

class Schema {
  public openApi
  public schemas
  constructor(openApi) {
    this.openApi = openApi
    this.schemas = this.openApi.components.schemas
  }

  public getServiceSchema(clusters: [string]): any {
    const schema = { ...this.schemas.Service }

    // TODO: provide domain zones available for the cluster
    const domains = ['a.com', 'b.com', 'c.com']
    addDomainEnumField(schema, domains)
    addClusterEnumField(schema, clusters)
    // applyAclToSchema(schema, role)
    return schema
  }

  public getTeamSchema(clusters: [string]): any {
    const schema = { ...this.schemas.Team }
    addEnumField(schema, clusters)
    return schema
  }

  public getTeamUiSchema(schema, role: string): any {
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

  public getServiceUiSchema(schema, role: string): any {
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
}

export default Schema
