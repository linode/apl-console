import { useReducer } from 'react'

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined]

export interface LoadingValue<T, E> {
  error?: E
  loading: boolean
  reset: () => void
  setError: (error: E) => void
  setValue: (value?: T | null) => void
  value?: T
}

interface ReducerState<E> {
  error?: E
  loading: boolean
  value?: any
}

interface ErrorAction<E> {
  type: 'error'
  error: E
}
interface ResetAction {
  type: 'reset'
  defaultValue?: any
}
interface ValueAction {
  type: 'value'
  value: any
}
type ReducerAction<E> = ErrorAction<E> | ResetAction | ValueAction

const defaultState = (defaultValue?: any): any => {
  return {
    loading: defaultValue === undefined || defaultValue === null,
    value: defaultValue,
  }
}

const reducer =
  <E>(): any =>
  (state: ReducerState<E>, action: ReducerAction<E>): ReducerState<E> => {
    switch (action.type) {
      case 'error':
        return {
          ...state,
          error: action.error,
          loading: false,
          value: undefined,
        }
      case 'reset':
        return defaultState(action.defaultValue)
      case 'value':
        return {
          ...state,
          error: undefined,
          loading: false,
          value: action.value,
        }
      default:
        return state
    }
  }

export default <T, E>(getDefaultValue?: () => T | null): LoadingValue<T, E> => {
  const defaultValue = getDefaultValue ? getDefaultValue() : undefined
  const [state, dispatch]: [any, any] = useReducer(reducer<E>(), defaultState(defaultValue))

  const reset = (): any => {
    const defaultValue = getDefaultValue ? getDefaultValue() : undefined
    dispatch({ type: 'reset', defaultValue })
  }

  const setError = (error: E): any => {
    dispatch({ type: 'error', error })
  }

  const setValue = (value?: T | null): any => {
    dispatch({ type: 'value', value })
  }

  return {
    error: state.error,
    loading: state.loading,
    reset,
    setError,
    setValue,
    value: state.value,
  }
}
