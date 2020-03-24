function addEnumField(schema, clusters): any {
  schema.properties.clusters.items.enum = clusters
}

function addClusterEnumField(schema, clusters): any {
  schema.properties.clusterId.enum = clusters
}

function addDomainEnumField(schema, domains): any {
  schema.properties.ingress.dependencies.hasPublicUrl.oneOf[0].properties.domain.enum = domains
}
class Schema {
  public openApi
  public schemas
  constructor(openApi) {
    this.openApi = openApi
    this.schemas = this.openApi.components.schemas
  }

  public getServiceSchema(clusters): any {
    const schema = { ...this.schemas.Service }
    schema.properties.ingress.dependencies = schema.properties.ingress['x-dependencies']
    schema.properties.spec.dependencies = schema.properties.spec['x-dependencies']

    // TODO: provide domain zones available for the cluster
    const domains = ['a.com', 'b.com', 'c.com']
    addDomainEnumField(schema, domains)
    addClusterEnumField(schema, clusters)
    return schema
  }

  public getTeamSchema(clusters): any {
    const schema = { ...this.schemas.Team }
    addEnumField(schema, clusters)
    return schema
  }

  public getTeamUiSchema(): any {
    const uiSchema = {
      teamId: { 'ui:widget': 'hidden' },
      password: { 'ui:widget': 'hidden' },
      clusters: {
        'ui:widget': 'checkboxes',
      },
    }

    return uiSchema
  }

  public getServiceUiSchema(schema): any {
    const uiSchema = {
      serviceName: { 'ui:widget': 'hidden' },
      teamId: { 'ui:widget': 'hidden' },
      serviceId: { 'ui:widget': 'hidden' },
      ksvc: {
        env: { 'ui:options': { orderable: false } },
      },
      annotations: { 'ui:options': { orderable: false } },
    }
    return uiSchema
  }
}

export default Schema
