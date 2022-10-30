/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
  isCorrupt: boolean
  isDirty: boolean | undefined
  isStale: boolean
}

const initialState = { error: undefined, isCorrupt: false, isDirty: undefined, isStale: false } as GlobalState

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setCorrupt: (state, action) => {
      state.isCorrupt = action.payload
    },
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

export const { setCorrupt, setDirty, setError, setStale } = slice.actions
export default slice.reducer
