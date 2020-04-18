/* eslint-disable no-prototype-builtins */
import * as _ from 'lodash'

export function getConditionRules(condition = ''): any {
  let rules = []
  let allHaveToMatch = false
  let visible = false

  // foo=bar || bar=foo
  if (condition.includes('||')) {
    rules = condition.split('||')
    allHaveToMatch = false
    visible = false
  }
  // foo=bar && bar=foo
  else if (condition.includes('&&')) {
    rules = condition.split('&&')
    allHaveToMatch = true
    visible = true
  }
  // foo=bar
  else {
    rules = [condition]
    allHaveToMatch = true
    visible = true
  }

  return {
    rules,
    allHaveToMatch,
    visible,
  }
}

export function getConditionRule(conditionRule): any {
  let rule = []
  let invert

  // foo!=bar
  if (conditionRule.indexOf('!=') !== -1) {
    rule = conditionRule.split('!=')
    invert = true
  }
  // foo=bar
  else if (conditionRule.indexOf('=') !== -1) {
    rule = conditionRule.split('=')
    invert = false
  }

  if (rule.length !== 2) {
    return false
  }

  const [field, v] = rule
  const values = v.split(',')

  return {
    field,
    values,
    invert,
  }
}

/**
 * Calculate new state for form based on UI Schema field conditions and current form data
 *
 * @param originalSchema - Original full schema containing all possible fields
 * @param originalUISchema - Original full UI Schema containing all possible fields
 * @param schema - Current schema
 * @param uiSchema - Current UI schema
 * @param formData - Current form data
 * @return {object} - Object containing new schema, uiSchema, and formData
 */
export function processForm(originalSchema, originalUISchema, schema, uiSchema, formData) {
  const conditionalFields = _.pickBy(uiSchema, (field: any) => field.hasOwnProperty('condition'))

  if (_.isEmpty(conditionalFields)) {
    return {
      schema,
      uiSchema,
      formData,
    }
  }

  const newSchema = _.assign({}, schema)
  const newUISchema = _.assign({}, uiSchema)
  let newFormData = _.assign({}, formData)

  _.each(conditionalFields, (dependantSchema, dependant) => {
    const { rules, allHaveToMatch } = getConditionRules(dependantSchema.condition)
    const matches = []
    _.each(rules, rule => {
      const { field, values: stringValues, invert } = getConditionRule(rule)
      let visible = invert

      const values = stringValues.map(value => value === 'true')

      if (field && newFormData.hasOwnProperty(field)) {
        const currentValues = _.isArray(newFormData[field]) ? newFormData[field] : [newFormData[field]]
        _.each(values, value => {
          if (invert) {
            visible = visible && _.indexOf(currentValues, value) === -1
          } else {
            visible = visible || _.indexOf(currentValues, value) !== -1
          }
        })
      }

      matches.push(visible)
    })

    // Add or remove conditional field from schema
    let shouldBeVisible = false
    if (matches.length) {
      shouldBeVisible = allHaveToMatch
        ? // foo=bar && bar=foo
          _.every(matches, Boolean)
        : // foo=bar || bar=foo
          _.some(matches, Boolean)
    }

    if (shouldBeVisible) {
      newSchema.properties[dependant] = originalSchema.properties[dependant]
    } else {
      newSchema.properties = _.omit(newSchema.properties, [dependant])
      newFormData = _.omit(newFormData, [dependant])
    }
  })

  // Update UI Schema UI order
  // react-jsonschema-form cannot handle extra properties found in UI order
  newUISchema['ui:order'] = _.intersection(originalUISchema['ui:order'], _.keys(newSchema.properties))
  // Update Schema required fields
  if (originalSchema.hasOwnProperty('required')) {
    newSchema.required = _.intersection(originalSchema.required, _.keys(newSchema.properties))
  }

  return {
    schema: newSchema,
    uiSchema: newUISchema,
    formData: newFormData,
  }
}
