import { get, set, unset } from 'lodash'

export { default as useLoadingValue } from './useLoadingValue'
export * from './refHooks'

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined]

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

export const isSomeOf = (schema) => ['allOf', 'anyOf', 'oneOf'].some((p) => p in schema)
