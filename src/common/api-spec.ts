import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { get, set } from 'lodash'
import { GetSessionApiResponse } from 'redux/otomiApi'

export const getIngressSchemaPath = (idx: number) => `properties.ingress.oneOf[${idx}].allOf[0].properties`

export const podSpecUiSchema = {
  files: { items: { content: { 'ui:widget': 'textarea' } } },
  secrets: {
    'ui:options': { addable: false, removable: false },
  },
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

export type JSONSchema7SchemaType = 'object' | 'array'

export interface OpenApi {
  components: {
    schemas: {
      [schemaName: string]: Schema
    }
  }
}
export interface Schema extends JSONSchema7 {
  'x-acl'?: Acl
  properties?: {
    [propertyName: string]: JSONSchema7Definition
  }
  items?: any
}

export interface Acl {
  team?: AclAction[]
  admin?: AclAction[]
}

let spec: OpenApi

export const getSpec = () => spec

export const applyAclToUiSchema = (
  uiSchema: any,
  user: GetSessionApiResponse['user'],
  teamId: string,
  schemaName: string,
): void => {
  if (user.isAdmin) return

  get(user, `authz.${teamId}.deniedAttributes.${schemaName}`, []).forEach((path) => {
    set(uiSchema, `${path}.ui:readonly`, true)
  })
}

export const setSpec = (inSpec): void => {
  spec = inSpec
}

export const deleteAlertEndpoints = (schema, formData) => {
  schema.properties.receivers.items.enum.forEach((receiver) => {
    if (!(formData?.receivers || []).includes(receiver) && !(formData?.drone || []).includes(receiver))
      // eslint-disable-next-line no-param-reassign
      delete schema.properties[receiver]
  })
}

export const setSecretsEnum = (schema, secrets) => {
  if (secrets.length) {
    const secretNames = secrets.filter((s) => s.secret.type !== 'docker_registry').map((s) => s.name)
    set(schema, `secrets.items.enum`, secretNames)
    set(schema, `secretMounts.items.properties.name.enum`, secretNames)
  } else {
    set(schema, `secrets.items.readOnly`, true)
    set(schema, `secretMounts.items.readOnly`, true)
  }
}
