import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import SettingPage from './Setting'

const edit = jest.fn()
const refetch = jest.fn()
const refetchSettings = jest.fn()

jest.mock('components/Setting', () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (data: object) => Promise<boolean> }) => (
    <button type='button' onClick={() => onSubmit({ name: 'updated' })}>
      Save
    </button>
  ),
}))
jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp }: { comp: React.ReactNode }) => <div>{comp}</div>,
}))
jest.mock('providers/Session', () => ({ useSession: () => ({ refetchSettings }) }))
jest.mock('redux/hooks', () => ({ useAppSelector: () => undefined }))
jest.mock('redux/otomiApi', () => ({
  useEditSettingsMutation: () => [edit, { isLoading: false }],
  useGetSettingsQuery: () => ({ data: { cluster: { name: 'old' }, obj: {} }, refetch }),
}))
jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))

beforeEach(() => {
  edit.mockReset()
  refetch.mockReset()
  refetchSettings.mockReset()
})

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/settings/cluster']}>
      <Route path='/settings/:settingId' component={SettingPage} />
    </MemoryRouter>,
  )

test('refreshes settings after a successful update', async () => {
  edit.mockResolvedValue({ data: {} })
  renderPage()
  fireEvent.click(screen.getByText('Save'))
  await waitFor(() => expect(refetchSettings).toHaveBeenCalled())
  expect(edit).toHaveBeenCalledWith({ settingId: 'cluster', body: { cluster: { name: 'updated' } } })
  expect(refetch).toHaveBeenCalledTimes(1)
})

test('does not refresh settings after a failed update', async () => {
  edit.mockResolvedValue({ error: { status: 500 } })
  renderPage()
  fireEvent.click(screen.getByText('Save'))
  await waitFor(() => expect(edit).toHaveBeenCalled())
  expect(refetch).not.toHaveBeenCalled()
  expect(refetchSettings).not.toHaveBeenCalled()
})
