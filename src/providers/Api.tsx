/* eslint-disable no-restricted-globals */
import { configureStore, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import React, { useContext, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { otomiApi } from 'store/otomi'
import { ApiError } from 'utils/error'
import snack from 'utils/snack'

export interface ApiContext {
  globalError: ApiError
  setGlobalError: CallableFunction
}

const Context = React.createContext<ApiContext>({
  globalError: undefined,
  setGlobalError: undefined,
})

export const useApi = (): ApiContext => useContext(Context)

interface Props {
  children: any
}

export const getErrorMiddleware =
  (setGlobalError): Middleware =>
  (api: MiddlewareAPI) =>
  (next) =>
  (action: any) => {
    const { error, payload } = action
    if (error && payload) {
      const {
        data: { message: err },
        status,
      } = payload
      console.error('We got a rejected action: ', payload)
      if (location.hostname === 'localhost')
        snack.error(`Api Error[${status}] calling '${action.meta?.arg?.endpointName}': ${err}`)
      setGlobalError(err)
    }
    return next(action)
  }

export default function ApiProvider({ children, ...other }: Props): React.ReactElement {
  const [globalError, setGlobalError] = useState()
  const store = configureStore({
    reducer: { [otomiApi.reducerPath]: otomiApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(otomiApi.middleware, getErrorMiddleware(setGlobalError)),
  })
  const ctx = useMemo(
    () => ({
      globalError,
      setGlobalError,
    }),
    [globalError],
  )
  return (
    <Context.Provider value={ctx}>
      <Provider store={store} {...other}>
        {children}
      </Provider>
    </Context.Provider>
  )
}
