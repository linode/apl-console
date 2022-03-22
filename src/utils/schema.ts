import { JSONSchema7 } from 'json-schema'
import { get, isEqual, memoize, set, unset } from 'lodash'

const getHolderPath = (p) => (p.includes('.') ? p.substr(0, p.lastIndexOf('.')) : p)

export function getStrict(obj: any, path: string, def: any = undefined) {
  const holderPath = getHolderPath(path)
  const val = get(obj, holderPath)
  if (val === undefined)
    throw new Error(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  return get(obj, path, def)
}

export function setStrict(obj: any, path: string, value: any) {
  const holderPath = getHolderPath(path)
  if (get(obj, holderPath) === undefined)
    throw new Error(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  set(obj, path, value)
}

export function unsetStrict(obj: any, path: string) {
  get(obj, path, undefined) // will warn if bogus path
  unset(obj, path)
}

export const isOneOf = (schema: JSONSchema7): boolean =>
  // we must be a oneOf option when one prop exists that has an enum of length 1
  schema.properties &&
  (!!Object.keys(schema.properties).find((prop) => (schema.properties[prop] as JSONSchema7).enum?.length === 1) ||
    (schema.properties?.[schema.title] && schema.required?.includes(schema.title)))

export const hasSomeOf = (schema) => {
  // we have to wrap items in allOf with one item passed, to be able to add
  // schema props such as 'title' so we exclude that scenario
  if (schema.allOf && schema.allOf.length === 1) return false
  return ['allOf', 'anyOf', 'oneOf'].some((p) => !!schema[p])
}

export const getSchemaType = (schema) => {
  if (typeof schema.type === 'object' && schema.type.length) return schema.type.filter((t) => t !== 'null')[0]
  return schema?.type ?? (schema.allOf && schema.allOf.length === 1 ? schema.allOf[0].type ?? 'object' : 'object')
}

export const traverse = (o, func, path = '') =>
  Object.getOwnPropertyNames(o).forEach((i) => {
    func(o, i, path)
    if (o[i] !== null && typeof o[i] === 'object') {
      // going one step down in the object tree!!
      traverse(o[i], func, path !== '' ? `${path}.${i}` : i)
    }
  })

export const nullify = (data) =>
  traverse(data, (o, i) => {
    // eslint-disable-next-line no-param-reassign
    if (typeof o[i] === 'object' && isEqual(o[i], {})) o[i] = null
  })

export const isOf = (o): boolean => Object.keys(o).some((p) => ['anyOf', 'allOf', 'oneOf'].includes(p))

export const extract = memoize((o, f) => {
  const schemaKeywords = ['properties', 'items', 'anyOf', 'allOf', 'oneOf', 'default', 'x-secret', 'x-acl']
  const leafs = {}
  traverse(o, (o, i, path) => {
    const res = f(o, i, path)
    if (!res) return
    const p = path
      .split('.')
      .filter((p: string) => !schemaKeywords.includes(p) && p !== `${parseInt(p, 10)}`)
      .join('.')
    if (!leafs[p]) leafs[p] = res
  })
  return leafs
})

export const propsToAccordion = ['image', 'resources']
