import { isControl, JsonSchema, rankWith, Tester, UISchemaElement } from '@jsonforms/core'
import _ from 'lodash'

export const isScopeEndInFieldList = (fieldsToHide: string[]): Tester => (uischema: UISchemaElement): boolean => {
  if (_.isEmpty(fieldsToHide) || !isControl(uischema)) {
    return false
  }
  const result = _.find(fieldsToHide, expected => {
    return _.endsWith(uischema.scope, expected)
  })

  return result ? true : false
}

const Factory = (fieldsToHide: string[], rank = 3): ((uischema: UISchemaElement, schema: JsonSchema) => number) => {
  return rankWith(rank, isScopeEndInFieldList(fieldsToHide))
}

export default Factory
