import { fireEvent, screen, waitFor } from '@testing-library/react'
import {
  change,
  mockEdit,
  mockError,
  mockGlobal,
  mockMutation,
  mockPush,
  mockQuery,
  mockRefetch,
  mockRefetchSettings,
  mockSuccess,
  renderSettingsPage,
  resetSettingsMocks,
  save,
} from '../settings-test-utils'
import ClusterSettingsPage from './ClusterSettingsPage'

beforeEach(() =>
  resetSettingsMocks({
    cluster: {
      name: 'cluster',
      provider: 'linode',
      owner: 'otomi',
      k8sContext: 'hidden',
      defaultStorageClass: 'standard',
      linode: { tier: 'enterprise' },
    },
  }),
)

test('edits the cluster while preserving hidden, read-only and unknown server fields', async () => {
  Object.assign(mockQuery.data.cluster, { futureField: { keep: true } })
  const { rerender } = renderSettingsPage(ClusterSettingsPage)
  expect(screen.getByLabelText('Provider')).toBeDisabled()
  expect(screen.queryByLabelText('K8s context')).not.toBeInTheDocument()
  expect(screen.queryByLabelText('Default storage class')).not.toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
  change('Name', 'updated')
  mockQuery.data = { cluster: { ...mockQuery.data.cluster } }
  rerender(<ClusterSettingsPage />)
  expect(screen.getByLabelText('Name')).toHaveValue('updated')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'cluster',
    body: { cluster: { ...mockQuery.data.cluster, name: 'updated' } },
  })

  expect(mockRefetch).toHaveBeenCalledTimes(1)
  expect(mockRefetchSettings).toHaveBeenCalledTimes(1)
  expect(mockSuccess).toHaveBeenCalled()
  expect(mockPush).toHaveBeenCalledWith('/settings')
})

test('query errors are visible and prevent saving', () => {
  mockQuery.isError = true
  renderSettingsPage(ClusterSettingsPage)
  expect(screen.getByText('Unable to load settings. Please try again.')).toBeInTheDocument()
  expect(screen.getByLabelText('Name')).toBeDisabled()
  fireEvent.submit(screen.getByRole('button', { name: 'Save Changes' }).closest('form'))
  expect(mockEdit).not.toHaveBeenCalled()
})

test('refreshes query data after deploying global changes', () => {
  mockGlobal.isDirty = false
  renderSettingsPage(ClusterSettingsPage)
  expect(mockRefetch).toHaveBeenCalledTimes(1)
})

test('invalid input displays validation errors without saving', async () => {
  renderSettingsPage(ClusterSettingsPage)
  change('Name', 'BAD')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('must match pattern')
  expect(mockEdit).not.toHaveBeenCalled()
})

test('failed saves show an error and retain edits for retry', async () => {
  mockEdit.mockResolvedValueOnce({ error: { status: 500 } })
  renderSettingsPage(ClusterSettingsPage)
  change('Name', 'updated')
  await save()
  await waitFor(() => expect(mockError).toHaveBeenCalled())
  expect(mockPush).not.toHaveBeenCalled()
  expect(mockRefetchSettings).not.toHaveBeenCalled()
  expect(mockSuccess).not.toHaveBeenCalled()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeEnabled()
  expect(screen.getByLabelText('Name')).toHaveValue('updated')
})

test.each(['fetching', 'mutating'])('saving is blocked while %s', (state) => {
  if (state === 'fetching') mockQuery.isFetching = true
  else mockMutation.isLoading = true
  renderSettingsPage(ClusterSettingsPage)
  change('Name', 'updated')
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
})

test('shows loading and cancels without saving', () => {
  mockQuery.isLoading = true
  const { unmount } = renderSettingsPage(ClusterSettingsPage)
  expect(screen.getByText('Loading settings')).toBeInTheDocument()
  unmount()
  mockQuery.isLoading = false
  renderSettingsPage(ClusterSettingsPage)
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  expect(mockPush).toHaveBeenCalledWith('/settings')
  expect(mockEdit).not.toHaveBeenCalled()
})
