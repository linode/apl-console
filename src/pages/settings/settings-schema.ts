import { JSONSchema7, JSONSchema7Definition } from 'json-schema'
import { cloneDeep, isEqual, mergeWith } from 'lodash'

export type SettingsSchema = JSONSchema7 & {
  'x-hidden'?: boolean
  'x-hideTitle'?: boolean
  'x-secret'?: unknown
  'x-decrypt'?: boolean
  'x-formtype'?: string
  'x-default'?: string
  'x-externalDocsPath'?: string
  nullable?: boolean
}

export const asSchema = (schema: JSONSchema7Definition): SettingsSchema => {
  if (!schema || typeof schema !== 'object') throw new Error('Unsupported settings schema')
  return schema
}

export const mergeSchemas = (schema: SettingsSchema): SettingsSchema => {
  const { allOf, ...base } = schema
  if (!allOf) return base
  return allOf.reduce<SettingsSchema>(
    (result, part) =>
      mergeWith(result, mergeSchemas(asSchema(part)), (oldValue, newValue) =>
        Array.isArray(oldValue) && Array.isArray(newValue) ? [...new Set([...oldValue, ...newValue])] : undefined,
      ),
    cloneDeep(base),
  )
}

export const selectedOption = (schema: SettingsSchema, value: unknown): number => {
  const options = schema.oneOf?.map(asSchema) ?? []
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 0
  const data = value as Record<string, unknown>
  let bestIndex = 0
  let bestScore = 0
  options.forEach((option, index) => {
    let score = 0
    Object.entries(option.properties ?? {}).forEach(([key, definition]) => {
      const property = asSchema(definition)
      if (data[key] === undefined || data[key] === null) return
      if (property.enum) {
        if (property.enum.some((item) => isEqual(item, data[key]))) score += 10
      } else score += 1
    })
    if (score > bestScore) {
      bestIndex = index
      bestScore = score
    }
  })
  return bestIndex
}

export const defaultsForSchema = (input: SettingsSchema, value: unknown): unknown => {
  const schema = mergeSchemas(input)
  if (value === null) return value
  if (schema.oneOf) {
    const option = asSchema(schema.oneOf[selectedOption(schema, value)])
    const { oneOf: _oneOf, ...base } = schema
    return defaultsForSchema(mergeSchemas({ ...base, allOf: [option] }), value)
  }
  if (value === undefined && schema.default !== undefined) return cloneDeep(schema.default)
  if (schema.properties) {
    const result: Record<string, unknown> =
      value && typeof value === 'object' && !Array.isArray(value) ? cloneDeep(value as Record<string, unknown>) : {}
    Object.entries(schema.properties).forEach(([key, property]) => {
      const next = defaultsForSchema(asSchema(property), result[key])
      if (next !== undefined) result[key] = next
    })
    return value !== undefined || Object.keys(result).length ? result : undefined
  }
  if (Array.isArray(value) && schema.items && !Array.isArray(schema.items))
    return value.map((item) => defaultsForSchema(asSchema(schema.items as JSONSchema7Definition), item))

  return value
}

export const activeSchema = (input: SettingsSchema, value: unknown): SettingsSchema => {
  let schema = mergeSchemas(input)
  if (schema.oneOf) {
    const option = asSchema(schema.oneOf[selectedOption(schema, value)])
    const { oneOf: _oneOf, ...base } = schema
    schema = mergeSchemas({ ...base, allOf: [option] })
  }
  if (schema.properties) {
    const data = value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
    schema.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([key, property]) => [key, activeSchema(asSchema(property), data[key])]),
    )
    if (schema.additionalProperties === false) {
      Object.keys(data).forEach((key) => {
        if (!(key in schema.properties)) schema.properties[key] = {}
      })
    }
  }
  if (schema.items && !Array.isArray(schema.items)) {
    // Items in these settings arrays share the same schema.
    schema.items = activeSchema(asSchema(schema.items), Array.isArray(value) ? value[0] : undefined)
  }
  return schema
}
