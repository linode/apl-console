function addEnumField(schema, clusters): any {
  schema.properties.clusters.items.enum = clusters
}

function addClusterEnumField(schema, clusters): any {
  schema.properties.clusterId.enum = clusters
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
      teamName: { 'ui:widget': 'hidden' },
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
      teamName: { 'ui:widget': 'hidden' },
      serviceType: { 'ui:widget': 'radio' },
      ksvc: {
        env: { 'ui:options': { orderable: false } },
      },
      annotations: { 'ui:options': { orderable: false } },
    }
    return uiSchema
  }
}

export default Schema
