/* eslint-disable no-restricted-globals */
import { AnyAction, configureStore, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import React, { useContext, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { otomiApi } from 'store/otomi'
import { ApiError } from 'utils/error'
import snack from 'utils/snack'

export interface ApiContext {
  globalError: ApiError
  setGlobalError: CallableFunction
  isDirty: boolean
}

const Context = React.createContext<ApiContext>({
  globalError: undefined,
  setGlobalError: undefined,
  isDirty: undefined,
})

export const useApi = (): ApiContext => useContext(Context)

interface Props {
  children: any
}

export const getErrorMiddleware =
  (setGlobalError, setDirty): Middleware =>
  (api: MiddlewareAPI) =>
  (next) =>
  (action: AnyAction) => {
    const { error, payload, meta } = action
    if (!error) {
      if (meta) {
        const {
          arg: { type, endpointName },
          requestStatus,
        } = meta
        // dirty logic: every MUTATION we deem to make state dirty
        if (type === 'mutation' && requestStatus === 'fulfilled') setDirty(true)
        // after we processed a successful deploy QUERY we reset dirty state
        if (endpointName === 'deploy' && requestStatus === 'fulfilled') setDirty(false)
      }
    } else if (payload) {
      const {
        data: { message: err },
        status,
      } = payload
      console.error('We got a rejected action with payload: ', payload)
      if (location.hostname === 'localhost')
        snack.error(`Api Error[${status}] calling '${action.meta?.arg?.endpointName}': ${err}`)
      setGlobalError(err)
    }
    return next(action)
  }

export default function ApiProvider({ children, ...other }: Props): React.ReactElement {
  const [globalError, setGlobalError] = useState()
  const [isDirty, setDirty] = useState()
  const store = configureStore({
    reducer: { [otomiApi.reducerPath]: otomiApi.reducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(otomiApi.middleware, getErrorMiddleware(setGlobalError, setDirty)),
  })
  const ctx = useMemo(
    () => ({
      globalError,
      setGlobalError,
      isDirty,
    }),
    [globalError, isDirty],
  )
  return (
    <Context.Provider value={ctx}>
      <Provider store={store} {...other}>
        {children}
      </Provider>
    </Context.Provider>
  )
}
