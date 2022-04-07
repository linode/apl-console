/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
  isDirty: boolean
}

const initialState = { error: undefined, isDirty: false } as GlobalState

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
