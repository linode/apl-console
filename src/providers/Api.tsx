/* eslint-disable no-restricted-globals */
import { AnyAction, configureStore, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import React, { useContext, useMemo, useState } from 'react'
import { Provider } from 'react-redux'
import { otomiApi } from 'store/otomi'
import { ApiError } from 'utils/error'
import snack from 'utils/snack'

export interface ApiContext {
  globalError: ApiError
  isDirty: boolean
  setDirty: CallableFunction
  setGlobalError: CallableFunction
}

const Context = React.createContext<ApiContext>({
  globalError: undefined,
  isDirty: undefined,
  setDirty: undefined,
  setGlobalError: undefined,
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
        if (type === 'mutation' && requestStatus === 'fulfilled') setTimeout(() => setDirty(true), 1000)
        // after we processed a successful deploy QUERY we reset dirty state
        if (endpointName === 'deploy' && requestStatus === 'fulfilled') setTimeout(() => setDirty(false), 1000)
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
      isDirty,
      setDirty,
      setGlobalError,
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
