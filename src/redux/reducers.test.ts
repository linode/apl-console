import reducer, { modalClosed, modalOpened, setDirty, setError } from './reducers'

describe('global reducer', () => {
  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      error: undefined,
      isDirty: undefined,
      isStale: false,
      openModalCount: 0,
    })
  })

  it('sets dirty state', () => {
    const state = reducer(undefined, setDirty(true))

    expect(state.isDirty).toBe(true)
  })

  it('sets global error', () => {
    const error = { message: 'Something went wrong' }

    const state = reducer(undefined, setError(error))

    expect(state.error).toEqual(error)
  })

  it('increments openModalCount when modal opens', () => {
    const state = reducer(undefined, modalOpened())

    expect(state.openModalCount).toBe(1)
  })

  it('decrements openModalCount when modal closes', () => {
    const openedState = reducer(undefined, modalOpened())
    const closedState = reducer(openedState, modalClosed())

    expect(closedState.openModalCount).toBe(0)
  })

  it('does not decrement openModalCount below zero', () => {
    const state = reducer(undefined, modalClosed())

    expect(state.openModalCount).toBe(0)
  })

  it('tracks multiple open modals', () => {
    const firstOpen = reducer(undefined, modalOpened())
    const secondOpen = reducer(firstOpen, modalOpened())
    const oneClosed = reducer(secondOpen, modalClosed())

    expect(secondOpen.openModalCount).toBe(2)
    expect(oneClosed.openModalCount).toBe(1)
  })
})
