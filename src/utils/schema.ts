import { pascalCase } from 'change-case'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, each, get, set, unset } from 'lodash'

const getHolderPath = (p) => (p.includes('.') ? p.substr(0, p.lastIndexOf('.')) : p)

export const getCoreAppId = (appId): string => {
  let id: string = appId
  if (appId.startsWith('rabbitmq')) id = 'rabbitmq'
  if (appId.startsWith('ingress-nginx')) id = 'ingress-nginx'
  return id
}

export const getAppSchemaName = (appId: string): string => {
  return `App${pascalCase(getCoreAppId(appId))}`
}

export function getStrict(obj: Record<string, any>, path: string, def: any = undefined) {
  const holderPath = getHolderPath(path)
  const val = get(obj, holderPath)
  if (val === undefined)
    throw new Error(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  return get(obj, path, def)
}

export function setStrict(obj: Record<string, any>, path: string, value: any) {
  const holderPath = getHolderPath(path)
  if (get(obj, holderPath) === undefined)
    throw new Error(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  set(obj, path, value)
}

export function unsetStrict(obj: Record<string, any>, path: string) {
  get(obj, path, undefined) // will warn if bogus path
  unset(obj, path)
}

export const hasSomeOf = (schema) => {
  // we have to wrap items in allOf with one item passed, to be able to add
  // schema props such as 'title' so we exclude that scenario
  if (schema.allOf && schema.allOf.length === 1) return false
  return ['allOf', 'anyOf', 'oneOf'].some((p) => !!schema[p])
}

export const getSchemaType = (schema: JSONSchema7): string => {
  if (typeof schema.type === 'object' && schema.type.length) return schema.type.filter((t: string) => t !== 'null')[0]
  const { allOf } = schema
  const first: JSONSchema7 | undefined = allOf?.length === 1 ? (allOf[0] as JSONSchema7) : undefined
  return (schema.type ?? first?.type ?? 'object') as string
}

export const isOf = (o: Record<string, any>): boolean =>
  Object.keys(o).some((p) => ['anyOf', 'allOf', 'oneOf'].includes(p))

export const traverse = (o: Record<string, any>, func, path = '') =>
  Object.getOwnPropertyNames(o).forEach((i) => {
    func(o, i, path)
    if (o[i] !== undefined && o[i] !== null && typeof o[i] === 'object') {
      // going one step down in the object tree!!
      traverse(o[i] as Record<string, any>, func, path !== '' ? `${path}.${i}` : i)
    }
  })

export const nullify = (data: Record<string, unknown>, schema: JSONSchema7) => {
  const nullMe = extract(schema, (o) => o['x-nullMe'])
  const d = cloneDeep(data || {})
  traverse(d, (o: Record<string, any>, i: string | number) => {
    // eslint-disable-next-line no-param-reassign
    if (o && o[i] === undefined) o[i] = null
  })
  each(nullMe, (v, path) => {
    set(d, path, null)
  })
  return d
}

export const extract = (o: JSONSchema7, f: CallableFunction) => {
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
}

export const propsToAccordion = ['resources', 'persistence']
