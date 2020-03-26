import { useEffect } from 'react'
import getClient, { getApiDefinition } from '../api'
import Schema from '../schema'
import { LoadingHook, useLoadingValue } from '../utils'
import { useSnackbar } from '../utils/snackbar'

export type ApiHook = LoadingHook<object, Error>

let client: any
let apiSpec: any
let schema: any
let dirty = false

export const schemaPromise = getApiDefinition().then(response => {
  apiSpec = response.data
  schema = new Schema(apiSpec)
  client = getClient(apiSpec)
})

const checkDirty = (method): boolean => {
  ;['create', 'edit', 'update', 'delete'].forEach(prefix => {
    if (method.indexOf(prefix) === 0) {
      dirty = true
    }
  })
  return dirty
}

export const useApi = (method: string, ...args: any[]): ApiHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<object, Error>()
  const { enqueueSnackbar } = useSnackbar()
  ;(async (): Promise<any> => {
    // tslint:disable-next-line
    try {
      if (!client[method]) {
        const err = `Api method does not exist: ${method}`
        setError(new Error(err))
        if (process.env.NODE_ENV !== 'production') {
          enqueueSnackbar(err, { variant: 'error' })
        } else {
          console.error(err)
        }
      } else {
        const value = await client[method].apply(client, args)
        checkDirty(method)
        setValue(value.data)
      }
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        enqueueSnackbar(`Api Error calling '${method}': ${e.toString()}`, { variant: 'error' })
      }
      console.error(`Api Error calling '${method}':`, e)
      setError(e)
    }
  })()

  return [value, loading, error]
}

export const getSchema = (): any => schema

export const getDirty = (): any => dirty
