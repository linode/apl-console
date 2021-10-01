/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
import { isEmpty, isPlainObject, transform } from 'lodash'

const cleanDeep = (
  object: any,
  {
    cleanKeys = [],
    cleanValues = [],
    cleanArrays = true,
    emptyArrays = true,
    emptyObjects = true,
    emptyStrings = true,
    NaNValues = false,
    nullValues = true,
    undefinedValues = true,
  } = {},
) => {
  return transform(object, (result, value, key) => {
    // Exclude specific keys.
    if (cleanKeys.includes(key)) {
      return
    }

    // Recurse into arrays and objects.
    if ((Array.isArray(value) && cleanArrays) || isPlainObject(value)) {
      value = cleanDeep(value, {
        NaNValues,
        cleanKeys,
        cleanValues,
        cleanArrays,
        emptyArrays,
        emptyObjects,
        emptyStrings,
        nullValues,
        undefinedValues,
      })
    }

    // Exclude specific values.
    if (cleanValues.includes(value)) {
      return
    }

    // Exclude empty objects.
    if (emptyObjects && isPlainObject(value) && isEmpty(value)) {
      return
    }

    // Exclude empty arrays.
    if (emptyArrays && Array.isArray(value) && !value.length) {
      return
    }

    // Exclude empty strings.
    if (emptyStrings && value === '') {
      return
    }

    // Exclude NaN values.
    if (NaNValues && Number.isNaN(value)) {
      return
    }

    // Exclude null values.
    if (nullValues && value === null) {
      return
    }

    // Exclude undefined values.
    if (undefinedValues && value === undefined) {
      return
    }

    // Append when recursing arrays.
    if (Array.isArray(result)) {
      // eslint-disable-next-line consistent-return
      return result.push(value)
    }

    result[key] = value
  })
}

export const cleanData = (obj: Record<string, unknown>): Record<string, unknown> => {
  const options = {
    cleanArrays: false,
    emptyArrays: false,
    emptyObjects: true,
    emptyStrings: true,
    nullValues: true,
    undefinedValues: true,
  }
  return cleanDeep(obj, options) as Record<string, unknown>
}
