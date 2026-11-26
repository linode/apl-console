import React, { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MenuItem } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import font from 'theme/font'
import palette from 'theme/palette'
import { SettingsSelect, SettingsStringList, SettingsTextField, SettingsYamlField } from './SettingsFields'

jest.mock('./SettingsForm', () => ({
  SettingsDisabledContext: jest.requireActual('react').createContext(false),
}))
jest.mock('yaml', () =>
  jest.requireActual(require.resolve('yaml/package.json').replace('package.json', 'dist/index.js')),
)

const theme = createTheme({ palette: palette.light, font })

function Fields() {
  const methods = useForm({
    defaultValues: {
      name: 'cluster',
      zones: ['example.com'],
      provider: { other: { 'external-dns': { token: 'value' } } },
    },
  })
  const [provider, setProvider] = useState('')
  return (
    <ThemeProvider theme={theme}>
      <FormProvider {...methods}>
        <SettingsTextField name='name' label='Name' />
        <SettingsSelect label='DNS provider' value={provider} onChange={setProvider}>
          <MenuItem value=''>None</MenuItem>
          <MenuItem value='aws'>AWS</MenuItem>
        </SettingsSelect>
        <SettingsStringList name='zones' label='Zone' />
        <SettingsYamlField name='provider.other.external-dns' label='DNS YAML' />
      </FormProvider>
    </ThemeProvider>
  )
}

test('real styled inputs are labelled, editable, and render repeatable rows and YAML', () => {
  render(<Fields />)
  expect(screen.getByLabelText('Name')).toHaveValue('cluster')
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'updated' } })
  expect(screen.getByLabelText('Name')).toHaveValue('updated')
  expect(screen.getByLabelText('Zone 1')).toHaveValue('example.com')
  fireEvent.click(screen.getByRole('button', { name: 'Add Zone' }))
  expect(screen.getByLabelText('Zone 2')).toHaveValue('')
  expect(screen.getByLabelText('DNS YAML')).toHaveValue('token: value\n')
})

test('real styled provider selects are accessible and switch options', async () => {
  const user = userEvent.setup()
  render(<Fields />)
  await user.click(screen.getByRole('combobox', { name: 'DNS provider' }))
  await user.click(screen.getByRole('option', { name: 'AWS' }))
  expect(screen.getByRole('combobox', { name: 'DNS provider' })).toHaveTextContent('AWS')
})
