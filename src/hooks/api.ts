import { useSnackbar } from 'material-ui-snackbar-provider'
import { useEffect } from 'react'
import getClient, { getApiDefinition } from '../api'
import Schema from '../schema'
import { LoadingHook, useLoadingValue } from '../utils'
// import { errDefaults } from '../utils/snackbar'

export type ApiHook = LoadingHook<object, Error>

let client: any
let apiSpec: any
let schema: any

export const useApi = (method: string, ...args: any[]): ApiHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<object, Error>()
  const snackbar = useSnackbar()
  useEffect(() => {
    ;(async (): Promise<any> => {
      try {
        if (!client) {
          const response = await getApiDefinition()
          apiSpec = response.data
          schema = new Schema(apiSpec)
          client = getClient(apiSpec)
        }
        const value = await client[method].apply(client, args)
        setValue(value.data)
      } catch (e) {
        console.error(e)
        snackbar.showMessage(e)
        setError(e)
      }
    })()
  }, [method, args, setError, setValue, snackbar])

  return [value, loading, error]
}

export const getSchema = (): any => {
  return schema
}
