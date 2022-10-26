/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
  isDirty: boolean
  isStale: boolean
}

const initialState = { error: undefined, isDirty: false, isStale: false } as GlobalState

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setDirty: (state, action) => {
      state.isDirty = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setStale: (state, action) => {
      state.isStale = action.payload
    },
  },
})

export const { setDirty, setError, setStale } = slice.actions
export default slice.reducer
