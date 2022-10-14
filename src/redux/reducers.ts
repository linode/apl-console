/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
}

const initialState = { error: undefined } as GlobalState

const slice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
  },
})

export const { setError } = slice.actions
export default slice.reducer
