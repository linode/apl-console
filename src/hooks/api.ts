import { useEffect } from 'react'
import getClient, { getApiDefinition } from '../api'
import { setSpec } from '../api-spec'
import { LoadingHook, useLoadingValue } from '../utils'
import { useSession } from '../session-context'

export type ApiHook = LoadingHook<object, Error>

let client: any
let apiSpec: any
let dirty = false

export const schemaPromise = getApiDefinition().then(response => {
  apiSpec = response.data
  setSpec(apiSpec)
  client = getClient(apiSpec)
})

const checkDirty = (method: any): boolean => {
  ;['create', 'edit', 'update', 'delete'].forEach(prefix => {
    if (method.indexOf(prefix) === 0) {
      dirty = true
    }
  })
  if (method.indexOf('deploy') === 0) {
    dirty = false
  }
  return dirty
}

export const useApi = (method: string, active = true, ...args: any[]): ApiHook => {
  const signature = `args.length:${args.length}/${args.join(',').length}`
  let canceled = false
  const { error, loading, setError, setValue, value } = useLoadingValue<any, Error>()
  const {
    user: { isAdmin },
    isDirty,
  } = useSession()
  dirty = dirty || isDirty
  useEffect(() => {
    ;(async (): Promise<any> => {
      if (!active) {
        setValue(undefined)
        return
      }
      try {
        if (!client[method]) {
          const err = `Api method does not exist: ${method}`
          setError(new Error(err))
          if (process.env.NODE_ENV !== 'production') {
            // enqueueSnackbar(err, { variant: 'error' })
          } else {
            // eslint-disable-next-line no-console
            console.error(err)
          }
        } else {
          if (canceled) return
          const value = await client[method].call(client, ...args)
          checkDirty(method)
          setValue(value.data)
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // enqueueSnackbar(`Api Error calling '${method}': ${e.toString()}`, { variant: 'error' })
        }
        // eslint-disable-next-line no-console
        console.warn(`Api Error calling '${method}':`, e)
        setError(e)
      }
    })()
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canceled = true
    }
  }, [method, signature, active, isAdmin])

  return [value, loading, error]
}

export const getDirty = (): any => dirty
