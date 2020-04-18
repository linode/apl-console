/* eslint-disable no-console */
import { useEffect } from 'react'
import getClient, { getApiDefinition } from '../api'
import { setSpec } from '../api-spec'
import { LoadingHook, useLoadingValue } from '../utils'
// import { useSnackbar } from '../utils/snackbar'
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

const checkDirty = (method): boolean => {
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

export const useApi = (method: string, ...args: any[]): ApiHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<any, Error>()
  // const { enqueueSnackbar } = useSnackbar()
  const {
    user: { isAdmin },
    isDirty,
  } = useSession()
  dirty = dirty || isDirty
  useEffect(() => {
    // tslint:disable-next-line: no-floating-promises
    ;(async (): Promise<any> => {
      try {
        if (!client[method]) {
          const err = `Api method does not exist: ${method}`
          setError(new Error(err))
          if (process.env.NODE_ENV !== 'production') {
            // enqueueSnackbar(err, { variant: 'error' })
          } else {
            console.error(err)
          }
        } else {
          const value = await client[method].call(client, ...args)
          checkDirty(method)
          setValue(value.data)
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          // enqueueSnackbar(`Api Error calling '${method}': ${e.toString()}`, { variant: 'error' })
        }
        console.error(`Api Error calling '${method}':`, e)
        setError(e)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, isAdmin])

  return [value, loading, error]
}

export const getDirty = (): any => dirty
