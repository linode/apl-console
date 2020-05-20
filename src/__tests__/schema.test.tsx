import { applyAclToUiSchema, Schema } from '../api-spec'

it('should make a field readonly since there is x-acl field', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
        'x-acl': {},
      },
      f2: {
        type: 'string',
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': true },
  }

  const uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'anonymous', 'create')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not add any readonly property since there is no x-acl', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
      },
    },
  }

  const expectedUiSchema = {}
  const uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'anonymous', 'create')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should make a field readonly due to single read permission', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['get'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': true },
  }

  const uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin', 'create')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not make a field readonly due to write permission', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['put'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': false },
  }

  const uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin', 'put')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not make a field readonly due to read and write permissions', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['get', 'put'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': false },
  }

  const uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin', 'put')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not overwrite existing uiSchema properties', () => {
  const schema: Schema = {
    type: 'object',
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['get'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { existing: 1, 'ui:readonly': true },
  }

  const uiSchema = { f1: { existing: 1 } }
  applyAclToUiSchema(uiSchema, schema, 'admin', 'create')
  expect(uiSchema).toEqual(expectedUiSchema)
})
