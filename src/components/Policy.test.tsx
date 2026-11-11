import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { setSpec } from 'common/api-spec'
import Policy from './Policy'

const mockSession = {
  user: {
    isPlatformAdmin: false,
    authz: { alpha: { deniedAttributes: { policy: [] as string[] } } },
  },
  oboTeamId: 'alpha',
}

jest.mock('providers/Session', () => ({ useSession: () => mockSession }))
jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))
jest.mock('./HeaderTitle', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))

const policy = { action: 'Audit' as const, severity: 'medium' as const, customValues: ['first'] }
const submit = jest.fn()

beforeEach(() => {
  mockSession.user.authz.alpha.deniedAttributes.policy = []
  submit.mockClear()
  setSpec({
    components: {
      schemas: {
        Policies: {
          properties: {
            example: {
              description: 'Policy description',
              properties: { customValues: { type: 'array', items: { type: 'string' } } },
            },
            simple: { properties: {} },
          },
        },
      },
    },
  })
})

const renderPolicy = (props: Partial<React.ComponentProps<typeof Policy>> = {}) =>
  render(
    <Policy
      teamId='alpha'
      policyName='example'
      policy={policy}
      editPolicies
      mutating={false}
      onSubmit={submit}
      {...props}
    />,
  )

test('edits policy options and custom values and submits the updated policy', () => {
  renderPolicy()
  expect(screen.getByText('Policy description')).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('Enforce'))
  fireEvent.click(screen.getByLabelText('high'))
  fireEvent.change(screen.getByLabelText('Custom value 1'), { target: { value: 'updated' } })
  fireEvent.click(screen.getByText('Add custom value'))
  fireEvent.change(screen.getByLabelText('Custom value 2'), { target: { value: 'second' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ action: 'Enforce', severity: 'high', customValues: ['updated', 'second'] })
  fireEvent.click(screen.getByLabelText('Remove custom value 1'))
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenLastCalledWith({ action: 'Enforce', severity: 'high', customValues: ['second'] })
})

test('respects field permissions and the policy edit permission', () => {
  mockSession.user.authz.alpha.deniedAttributes.policy = ['action', 'customValues']
  const { rerender } = renderPolicy()
  expect(screen.getByLabelText('Enforce')).toBeDisabled()
  expect(screen.getByLabelText('Custom value 1')).toBeDisabled()
  expect(screen.getByText('Add custom value')).toBeDisabled()
  expect(screen.getByLabelText('high')).toBeEnabled()
  rerender(
    <Policy
      teamId='alpha'
      policyName='example'
      policy={policy}
      editPolicies={false}
      mutating={false}
      onSubmit={submit}
    />,
  )
  expect(screen.getByText('Submit')).toBeDisabled()
  expect(screen.getByLabelText('high')).toBeDisabled()
})

test('updates when the fetched policy changes and hides fields absent from its schema', () => {
  const { rerender } = renderPolicy({ policy: undefined })
  expect(screen.getByText('Submit')).toBeDisabled()
  rerender(
    <Policy
      teamId='alpha'
      policyName='simple'
      policy={{ action: 'Enforce', severity: 'low' }}
      editPolicies
      mutating={false}
      onSubmit={submit}
    />,
  )
  expect(screen.getByLabelText('Enforce')).toBeChecked()
  expect(screen.getByLabelText('low')).toBeChecked()
  expect(screen.queryByText('Add custom value')).not.toBeInTheDocument()
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ action: 'Enforce', severity: 'low' })
})

test('submits the displayed defaults and removes empty custom values', () => {
  renderPolicy({ policy: { action: undefined, severity: undefined, customValues: ['', 'retained'] } })
  expect(screen.getByLabelText('Audit')).toBeChecked()
  expect(screen.getByLabelText('medium')).toBeChecked()
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ action: 'Audit', severity: 'medium', customValues: ['retained'] })
})
