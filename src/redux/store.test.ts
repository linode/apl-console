/** @jest-environment node */
import { otomiApi } from './otomiApi'
import { modalClosed, modalOpened, setError } from './reducers'
import { store } from './store'

describe('password reset API and modal error isolation', () => {
  beforeEach(() => {
    store.dispatch(setError(undefined))
    const NativeRequest = global.Request
    jest
      .spyOn(global, 'Request')
      .mockImplementation(
        (input, init) =>
          new NativeRequest(typeof input === 'string' ? new URL(input, 'http://localhost') : input, init),
      )
    jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })

  afterEach(() => {
    store.dispatch(otomiApi.util.resetApiState())
    while (store.getState().global.openModalCount > 0) store.dispatch(modalClosed())
    jest.restoreAllMocks()
  })

  const resetPassword = () =>
    store.dispatch(
      otomiApi.endpoints.resetPassword.initiate({
        body: { currentPassword: 'current-password', newPassword: 'new-password' },
      }),
    )

  const adminResetPassword = () =>
    store.dispatch(
      otomiApi.endpoints.editUser.initiate({
        userId: 'user-1',
        body: { email: 'user@example.com', initialPassword: 'new-password' },
      }),
    )

  it('sends both passwords to the real endpoint and accepts 204', async () => {
    const fetch = jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 204 }))

    await expect(resetPassword()).resolves.toEqual({ data: null })

    expect(fetch).toHaveBeenCalledTimes(1)
    const request = fetch.mock.calls[0][0] as Request
    expect(request.url).toBe('http://localhost/api/v2/user/reset-password')
    expect(request.method).toBe('POST')
    expect(await request.json()).toEqual({ currentPassword: 'current-password', newPassword: 'new-password' })
  })

  it('returns an incorrect password as data without setting a page error', async () => {
    const data = { statusCode: 401, message: 'Current password is incorrect.' }
    jest.spyOn(global, 'fetch').mockResolvedValue(Response.json(data))

    await expect(resetPassword()).resolves.toEqual({ data })
    expect(store.getState().global.error).toBeUndefined()
  })

  it('does not store a modal request failure as a page error, even after closing', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(Response.json({ error: 'Unavailable' }, { status: 503 }))
    store.dispatch(modalOpened())

    expect(await resetPassword()).toHaveProperty('error.status', 503)
    expect(store.getState().global.error).toBeUndefined()
    store.dispatch(modalClosed())
    expect(store.getState().global.error).toBeUndefined()
  })

  it('preserves page-level error handling when no modal is open', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(Response.json({ error: 'Unavailable' }, { status: 503 }))

    await resetPassword()

    expect(store.getState().global.error).toMatchObject({ status: 503, data: { error: 'Unavailable' } })
  })

  it.each([
    { status: 400, data: { message: 'Password rejected' } },
    { status: 503, data: { message: 'Service Unavailable' } },
  ])('isolates admin reset errors from the page, including after closing ($status)', async ({ status, data }) => {
    jest.spyOn(global, 'fetch').mockResolvedValue(Response.json(data, { status }))
    store.dispatch(modalOpened())

    expect(await adminResetPassword()).toHaveProperty('error.status', status)
    expect(store.getState().global.error).toBeUndefined()
    store.dispatch(modalClosed())
    expect(store.getState().global.error).toBeUndefined()
  })

  it('isolates an admin reset network failure without changing normal edit error handling', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'))
    store.dispatch(modalOpened())

    expect(await adminResetPassword()).toHaveProperty('error.status', 'FETCH_ERROR')
    expect(store.getState().global.error).toBeUndefined()
    store.dispatch(modalClosed())
    expect(store.getState().global.error).toBeUndefined()

    expect(await adminResetPassword()).toHaveProperty('error.status', 'FETCH_ERROR')
    expect(store.getState().global.error).toMatchObject({ status: 'FETCH_ERROR' })
  })
})
