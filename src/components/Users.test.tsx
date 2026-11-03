import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Users from './Users'

let mockThemeView = 'platform'
let mockOboTeamId = 'admin'

jest.mock('hooks/useSettings', () => ({
  __esModule: true,
  default: () => ({ themeView: mockThemeView }),
}))
jest.mock('providers/Session', () => ({
  useSession: () => ({
    user: { isPlatformAdmin: true },
    oboTeamId: mockOboTeamId,
    settings: { otomi: { hasExternalIDP: false } },
  }),
}))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      if (key === 'User_plural') return 'Users'
      if (key === 'BUTTON_NEW_RESOURCE') return 'New User'
      return key
    },
  }),
}))
jest.mock('redux/otomiApi', () => ({
  useEditTeamUsersMutation: () => [jest.fn()],
}))
jest.mock('./HeaderTitle', () => ({
  __esModule: true,
  default: () => <h1>Users</h1>,
}))
jest.mock('./EnhancedTable', () => ({
  __esModule: true,
  default: () => null,
}))

describe('user directory navigation', () => {
  it.each(['admin', 'alpha'])('opens platform user creation without the %s team filter', (teamId) => {
    mockThemeView = 'platform'
    mockOboTeamId = teamId
    render(
      <MemoryRouter>
        <Users users={[]} refetch={jest.fn()} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'New User' })).toHaveAttribute('href', '/users/create')
  })

  it('preserves team membership management without a create link in the team view', () => {
    mockThemeView = 'team'
    mockOboTeamId = 'alpha'
    render(
      <MemoryRouter>
        <Users users={[]} teamId='alpha' refetch={jest.fn()} />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('link', { name: 'New User' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Users' })).toBeDisabled()
  })
})
