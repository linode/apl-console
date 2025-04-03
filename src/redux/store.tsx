/* eslint-disable no-restricted-globals */
import { AnyAction, Middleware, MiddlewareAPI, configureStore } from '@reduxjs/toolkit'
import { otomiApi } from 'redux/otomiApi'
import globalReducer, { GlobalState, setDirty, setError } from 'redux/reducers'

const interceptMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  const { error, payload, meta } = action
  console.log({ error, payload, meta })
  const { dispatch } = api
  if (!error) {
    if (meta) {
      const type = meta?.arg?.type
      const endpointName = meta?.arg?.endpointName
      const { requestStatus } = meta
      // dirty logic: every MUTATION we deem to make state dirty
      if (type === 'mutation' && requestStatus === 'pending') dispatch(setDirty(null))
      if (type === 'mutation' && requestStatus === 'fulfilled') dispatch(setDirty(true))
      // after we processed a successful deploy QUERY we reset dirty state
      if (['deploy', 'revert', 'restore'].includes(endpointName as string)) {
        // clear state
        if (requestStatus === 'fulfilled') dispatch(setDirty(false))
      }
      // exclude endpoints from dirty state
      if (type === 'mutation' && ['workloadCatalog', 'createObjWizard'].includes(endpointName as string))
        dispatch(setDirty(false))
    }
  } else if (payload) {
    // eslint-disable-next-line no-console
    console.error('Rejected action detected:', {
      type: action.type,
      payload,
      meta,
    })
    dispatch(setError(payload))
    dispatch(setDirty(false))
  }
  return next(action)
}

const reducer = {
  [otomiApi.reducerPath]: otomiApi.reducer,
  global: globalReducer,
}
export type ReducerState = {
  [otomiApi.reducerPath]: typeof otomiApi.reducer
  global: GlobalState
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(otomiApi.middleware, interceptMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
