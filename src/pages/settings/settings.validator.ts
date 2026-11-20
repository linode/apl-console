import { toNestErrors } from '@hookform/resolvers'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { getSpec } from 'common/api-spec'
import { cloneDeep, get, set } from 'lodash'
import { FieldError, FieldValues, Resolver } from 'react-hook-form'
import { cleanData } from 'utils/data'
import { nullify } from 'utils/schema'
import YAML from 'yaml'
import { SettingsSchema, activeSchema } from './settings-schema'

export const getSettingsSchema = (settingId: string): SettingsSchema => {
  const definition = getSpec().components.schemas.Settings.properties[settingId]
  if (!definition || typeof definition !== 'object') throw new Error(`Unknown setting schema: ${settingId}`)
  return cloneDeep(definition)
}

export const settingsResolver = <T extends FieldValues>(schema: SettingsSchema): Resolver<T> => {
  const ajv = new Ajv({ allErrors: true, strict: false })
  addFormats(ajv)
  const validators = new Map<string, ValidateFunction>()
  return (values, _, options) => {
    const parsedValues = cloneDeep(values)
    const errors: Record<string, FieldError> = {}
    ;['provider.other.external-dns', 'provider.other.cert-manager'].forEach((path) => {
      const value = get(parsedValues, path)
      if (typeof value !== 'string') return
      try {
        const parsed: unknown = YAML.parse(value)
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          errors[path] = { type: 'type', message: 'Enter a YAML object' }
          return
        }
        set(parsedValues, path, parsed)
      } catch (error) {
        errors[path] = { type: 'parse', message: error instanceof Error ? error.message : 'Invalid YAML' }
      }
    })
    if (Object.keys(errors).length) return { values: {}, errors: toNestErrors<T>(errors, options) }
    const active = activeSchema(schema, parsedValues)
    const key = JSON.stringify(active)
    let validate = validators.get(key)
    if (!validate) {
      validate = ajv.compile(active)
      validators.set(key, validate)
    }
    const data = cleanData(parsedValues, {
      emptyArrays: false,
      emptyObjects: false,
      nullValues: false,
      undefinedValues: false,
    })
    if (validate(data)) return { values: parsedValues, errors: {} }
    validate.errors?.forEach((error) => {
      const path = error.instancePath
        .split('/')
        .slice(1)
        .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'))
      if (error.keyword === 'required' && typeof error.params.missingProperty === 'string')
        path.push(error.params.missingProperty)
      const key = path.join('.') || 'root'
      if (!errors[key]) errors[key] = { type: error.keyword, message: error.message }
    })
    return { values: {}, errors: toNestErrors<T>(errors, options) }
  }
}

export const settingsPayload = (values: FieldValues, schema: SettingsSchema): Record<string, unknown> =>
  nullify(cleanData(values, { emptyArrays: false, nullValues: false, undefinedValues: false }), schema)
