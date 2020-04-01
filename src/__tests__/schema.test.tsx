import { applyAclToUiSchema } from '../schema'

it('should make a field readonly since there is x-acl field', () => {
  const schema = {
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

  let uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'anonymous')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not add any readonly property since there is no x-acl', () => {
  const schema = {
    properties: {
      f1: {
        type: 'string',
      },
    },
  }

  const expectedUiSchema = {}
  let uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'anonymous')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should make a field readonly due to single read permission', () => {
  const schema = {
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['read'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': true },
  }

  let uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not make a field readonly due to write permission', () => {
  const schema = {
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['write'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': false },
  }

  let uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not make a field readonly due to read and write permissions', () => {
  const schema = {
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['read', 'write'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { 'ui:readonly': false },
  }

  let uiSchema = {}
  applyAclToUiSchema(uiSchema, schema, 'admin')
  expect(uiSchema).toEqual(expectedUiSchema)
})

it('should not overwrite existing uiSchema properties', () => {
  const schema = {
    properties: {
      f1: {
        type: 'string',
        'x-acl': { admin: ['read'] },
      },
    },
  }

  const expectedUiSchema = {
    f1: { exisitng: 1, 'ui:readonly': true },
  }

  let uiSchema = { f1: { exisitng: 1 } }
  applyAclToUiSchema(uiSchema, schema, 'admin')
  expect(uiSchema).toEqual(expectedUiSchema)
})
