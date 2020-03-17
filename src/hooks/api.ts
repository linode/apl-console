import { useEffect, useState } from 'react'
import getClient, { getApiDefinition } from '../api'

import { LoadingHook, useLoadingValue } from '../utils'

export type ApiHook = LoadingHook<object, Error>

let client: any

export const useApi = (method: string, ...args: any[]): ApiHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<object, Error>()
  useEffect(() => {
    ;(async (): Promise<any> => {
      try {
        if (!client) {
          const response = await getApiDefinition()
          const apiSpec = response.data
          client = getClient(apiSpec)
        }
        const value = await client[method].apply(args)
        setValue(value.data)
      } catch (e) {
        console.error(e)
        setError(e)
      }
    })()
  }, [method])

  return [value, loading, error]
}
