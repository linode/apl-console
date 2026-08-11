import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import useOffSetTop from 'hooks/useOffSetTop'
import useResponsive from 'hooks/useResponsive'
import useSettings from 'hooks/useSettings'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { useSession } from 'providers/Session'
import { useGetAplTeamsQuery } from 'redux/otomiApi'
import Header from './Header'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn(),
}))

jest.mock('hooks/useOffSetTop')
jest.mock('hooks/useResponsive')
jest.mock('hooks/useSettings')
jest.mock('hooks/useLocalStorage')
jest.mock('providers/Session')
jest.mock('redux/otomiApi')

jest.mock('./AccountPopover', () => () => null)

jest.mock('./animate', () => ({
  IconButtonAnimate: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
}))

jest.mock('./Iconify', () => () => null)

jest.mock('config', () => ({
  HEADER: {
    MOBILE_HEIGHT: 64,
    DASHBOARD_DESKTOP_HEIGHT: 80,
    DASHBOARD_DESKTOP_OFFSET_HEIGHT: 64,
  },
  NAVBAR: {
    DASHBOARD_WIDTH: 280,
    DASHBOARD_COLLAPSE_WIDTH: 88,
  },
}))

const mockedUseHistory = useHistory as jest.MockedFunction<typeof useHistory>
const mockedUseLocation = useLocation as jest.MockedFunction<typeof useLocation>
const mockedUseOffSetTop = useOffSetTop as jest.MockedFunction<typeof useOffSetTop>
const mockedUseResponsive = useResponsive as jest.MockedFunction<typeof useResponsive>
const mockedUseSettings = useSettings as jest.MockedFunction<typeof useSettings>
const mockedUseLocalStorage = useLocalStorage as jest.MockedFunction<typeof useLocalStorage>
const mockedUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockedUseGetAplTeamsQuery = useGetAplTeamsQuery as jest.MockedFunction<typeof useGetAplTeamsQuery>

const mockPush = jest.fn()
const mockSetOboTeamId = jest.fn()
const mockOnChangeView = jest.fn()

type RenderHeaderOptions = {
  pathname?: string
  oboTeamId?: string
  themeView?: 'team' | 'platform'
  isPlatformAdmin?: boolean
}

const renderHeader = ({
  pathname = '/teams/alpha',
  oboTeamId = 'alpha',
  themeView = 'team',
  isPlatformAdmin = false,
}: RenderHeaderOptions = {}) => {
  mockedUseLocation.mockReturnValue({
    pathname,
    search: '',
    hash: '',
    state: undefined,
  })

  mockedUseSession.mockReturnValue({
    user: {
      email: 'user@example.com',
      teams: ['alpha', 'beta'],
      isPlatformAdmin,
    },
    oboTeamId,
    setOboTeamId: mockSetOboTeamId,
  } as unknown as ReturnType<typeof useSession>)

  mockedUseSettings.mockReturnValue({
    themeView,
    onChangeView: mockOnChangeView,
  } as unknown as ReturnType<typeof useSettings>)

  mockedUseLocalStorage.mockReturnValue([undefined, jest.fn()] as unknown as ReturnType<typeof useLocalStorage>)

  mockedUseGetAplTeamsQuery.mockReturnValue({
    data: undefined,
  } as unknown as ReturnType<typeof useGetAplTeamsQuery>)

  return render(<Header onOpenSidebar={jest.fn()} />)
}

const selectTeam = async (currentTeamName: string, nextTeamName: string) => {
  const teamSelect = screen.getByRole('button', {
    name: currentTeamName,
  })

  fireEvent.mouseDown(teamSelect)

  const option = await screen.findByRole('option', {
    name: nextTeamName,
  })

  fireEvent.click(option)
}

describe('Header team switching', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockedUseHistory.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useHistory>)

    mockedUseOffSetTop.mockReturnValue(false)
    mockedUseResponsive.mockReturnValue(true)
  })

  it('switches from one team dashboard to another team dashboard', async () => {
    renderHeader({
      pathname: '/teams/alpha',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/teams/beta')
  })

  it('preserves the section when switching from a section overview', async () => {
    renderHeader({
      pathname: '/teams/alpha/services',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/teams/beta/services')
  })

  it('redirects a resource detail page to the section overview', async () => {
    renderHeader({
      pathname: '/teams/alpha/services/myservice',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/teams/beta/services')
  })

  it('redirects deeply nested resource pages to the section overview', async () => {
    renderHeader({
      pathname: '/teams/alpha/services/myservice/edit',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/teams/beta/services')
  })

  it('redirects non-team routes to the selected team dashboard', async () => {
    renderHeader({
      pathname: '/some-other-page',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/teams/beta')
  })

  it('does nothing when the currently active team remains selected', () => {
    renderHeader({
      pathname: '/teams/alpha/services',
    })

    const hiddenInput = document.querySelector('[data-cy="select-oboteam"] input')

    fireEvent.change(hiddenInput, {
      target: {
        value: 'alpha',
      },
    })

    expect(mockSetOboTeamId).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('switches the team on an apps route', async () => {
    renderHeader({
      pathname: '/apps/alpha',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/apps/beta')
  })

  it('stays on the root route when switching teams', async () => {
    renderHeader({
      pathname: '/',
    })

    await selectTeam('alpha', 'beta')

    expect(mockSetOboTeamId).toHaveBeenCalledWith('beta')
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
