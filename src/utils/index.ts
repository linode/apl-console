import { get as loGet, set as loSet, unset as loUnset } from 'lodash'

export { default as useLoadingValue } from './useLoadingValue'
export * from './refHooks'

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined]

const getHolderPath = (p) => (p.includes('.') ? p.substr(0, p.lastIndexOf('.')) : p)

export function get(obj: any, path: string, def: any = undefined) {
  const holderPath = getHolderPath(path)
  const val = loGet(obj, holderPath)
  if (val === undefined)
    console.warn(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  return loGet(obj, path, def)
}

export function set(obj: any, path: string, value: any) {
  const holderPath = getHolderPath(path)
  if (loGet(obj, holderPath) === undefined)
    console.warn(`Path ${path} does not exist on obj. Existing props: ${JSON.stringify(Object.keys(obj))}`)
  loSet(obj, path, value)
}

export function unset(obj: any, path: string) {
  get(obj, path, undefined) // will warn if bogus path
  loUnset(obj, path)
}

export const isSomeOf = (schema) => ['allOf', 'anyOf', 'oneOf'].some((p) => p in schema)
