import { applyAclToUiSchema } from '../api-spec'

it('should not make a field readonly due to read and write permissions', () => {
  const deniedAttributes = ['a.b.c']
  const expectedUiSchema = {
    a: { b: { c: { 'ui:readonly': true } } },
  }
  const uiSchema = {}

  // applyAclToUiSchema(uiSchema, deniedAttributes)
  // expect(uiSchema).toEqual(expectedUiSchema)
  expect(uiSchema).toEqual(expectedUiSchema)
})
