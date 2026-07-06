/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'

export interface GlobalState {
  error: any
  isDirty: boolean | undefined | null
  openModalCount: number
}

const initialState = {
  error: undefined,
  isDirty: undefined,
  isStale: false,
  openModalCount: 0,
} as GlobalState

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
    modalOpened: (state) => {
      state.openModalCount += 1
    },
    modalClosed: (state) => {
      state.openModalCount = Math.max(0, state.openModalCount - 1)
    },
  },
})

export const { setDirty, setError, modalOpened, modalClosed } = slice.actions
export default slice.reducer
