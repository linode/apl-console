/* eslint-disable no-restricted-globals */
import { AnyAction, Middleware, MiddlewareAPI, configureStore } from '@reduxjs/toolkit'
import { otomiApi } from 'redux/otomiApi'
import globalReducer, { GlobalState, setDirty, setError } from 'redux/reducers'

const interceptMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  const { error, payload, meta } = action
  const { dispatch } = api
  if (!error) {
    if (meta) {
      const {
        arg: { type, endpointName },
        requestStatus,
      } = meta
      // dirty logic: every MUTATION we deem to make state dirty
      if (type === 'mutation' && requestStatus === 'pending') dispatch(setDirty(null))
      if (type === 'mutation' && requestStatus === 'fulfilled') dispatch(setDirty(true))
      // after we processed a successful deploy QUERY we reset dirty state
      if (['deploy', 'revert', 'restore'].includes(endpointName as string)) {
        // clear state
        if (requestStatus === 'fulfilled') dispatch(setDirty(false))
      }
    }
  } else if (payload) {
    // eslint-disable-next-line no-console
    console.error('We got a rejected action with payload: ', payload)
    dispatch(setError(payload))
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
