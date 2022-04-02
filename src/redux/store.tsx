/* eslint-disable no-restricted-globals */
import { AnyAction, configureStore, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { otomiApi } from 'redux/otomiApi'
import globalReducer, { GlobalState, setDirty, setError } from 'redux/reducers'
import snack from 'utils/snack'

export const errorMiddleware: Middleware = (api: MiddlewareAPI) => (next) => (action: AnyAction) => {
  const { error, payload, meta } = action
  const { dispatch } = api
  if (!error) {
    if (meta) {
      const {
        arg: { type, endpointName },
        requestStatus,
      } = meta
      // dirty logic: every MUTATION we deem to make state dirty
      if (type === 'mutation' && requestStatus === 'fulfilled') dispatch(setDirty(true))
      // after we processed a successful deploy QUERY we reset dirty state
      if (endpointName === 'deploy' && requestStatus === 'fulfilled') dispatch(setDirty(false))
    }
  } else if (payload) {
    const {
      data: { error: err },
      status,
    } = payload
    console.error('We got a rejected action with payload: ', payload)
    if (location.hostname === 'localhost')
      snack.error(`Api Error[${status}] calling '${action.meta?.arg?.endpointName}': ${err}`)
    // dispatch error also
    dispatch(setError(payload))
  }
  return next(action)
}

const reducer = {
  [otomiApi.reducerPath]: otomiApi.reducer,
  global: globalReducer,
}
export type ReducerState = {
  [otomiApi.reducerPath]: typeof reducer
  global: GlobalState
}
interface Props {
  children: any
}

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(otomiApi.middleware, errorMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
