/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
  isDirty: boolean | undefined | null
}

const initialState = { error: undefined, isDirty: undefined, isStale: false } as GlobalState

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
  },
})

export const { setDirty, setError } = slice.actions
export default slice.reducer
