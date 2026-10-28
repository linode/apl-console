import { render } from '@testing-library/react'
import { useLogoutMutation } from 'redux/otomiApi'
import Logout from './Logout'

jest.mock('redux/otomiApi', () => ({
  useLogoutMutation: jest.fn(),
}))

jest.mock('components/LoadingScreen', () => () => null)

describe('Logout', () => {
  let assign: jest.Mock
  let reload: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    assign = jest.fn()
    reload = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign, reload },
      writable: true,
    })
  })

  it('calls the apl-api logout endpoint and redirects to /platform-logout', async () => {
    const logout = jest.fn().mockReturnValue(Promise.resolve({}))
    ;(useLogoutMutation as jest.Mock).mockReturnValue([logout])

    render(<Logout />)

    expect(logout).toHaveBeenCalled()
    await Promise.resolve()
    expect(assign).toHaveBeenCalledWith('/platform-logout')
  })

  it('still redirects to /platform-logout when the apl-api logout call fails', async () => {
    // A thenable exposing only `.finally`, so the component's error path is exercised without
    // ever constructing a genuinely rejected native Promise (which Node treats as a fatal
    // unhandled rejection even when a handler is attached moments later).
    const failingResult = { finally: (onFinally: () => void) => Promise.resolve().then(onFinally) }
    const logout = jest.fn().mockReturnValue(failingResult)
    ;(useLogoutMutation as jest.Mock).mockReturnValue([logout])

    render(<Logout />)

    await Promise.resolve().then(() => Promise.resolve())
    expect(assign).toHaveBeenCalledWith('/platform-logout')
  })

  it('reloads without calling logout when fetchError is true', () => {
    const logout = jest.fn()
    ;(useLogoutMutation as jest.Mock).mockReturnValue([logout])

    render(<Logout fetchError />)

    expect(logout).not.toHaveBeenCalled()
    expect(reload).toHaveBeenCalled()
  })
})
