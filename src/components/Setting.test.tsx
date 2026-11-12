import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setSpec } from 'common/api-spec'
import Setting from './Setting'

jest.mock('yaml', () =>
  jest.requireActual(require.resolve('yaml/package.json').replace('package.json', 'dist/index.js')),
)

const mockSession = {
  appsEnabled: { harbor: true, gitea: true, alertmanager: true },
  settings: { otomi: { isPreInstalled: false, hasExternalDNS: true } },
}
jest.mock('providers/Session', () => ({ useSession: () => mockSession }))
jest.mock('./HeaderTitle', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}))

const text = { type: 'string' }
const backupApp = {
  properties: {
    enabled: { type: 'boolean', default: false },
    schedule: { type: 'string', default: 'daily' },
  },
}
const schemas = {
  cluster: {
    type: 'object',
    additionalProperties: false,
    required: ['name', 'provider'],
    properties: {
      name: { ...text, title: 'Name', pattern: '^[a-z]+$' },
      provider: { ...text, title: 'Provider', enum: ['linode', 'custom'] },
      k8sContext: text,
    },
  },
  alerts: {
    type: 'object',
    properties: {
      receivers: { type: 'array', uniqueItems: true, items: { ...text, enum: ['slack', 'msteams', 'none'] } },
      slack: { title: 'Slack', properties: { url: { ...text, title: 'Webhook', 'x-secret': true } } },
      msteams: { title: 'Microsoft Teams', properties: { url: text } },
    },
  },
  dns: {
    type: 'object',
    properties: {
      zones: { type: 'array', title: 'Zones', uniqueItems: true, items: text },
      provider: {
        title: 'Provider',
        oneOf: [
          { title: 'None', type: 'object', additionalProperties: false, nullable: true },
          {
            title: 'AWS',
            type: 'object',
            required: ['aws'],
            properties: { aws: { properties: { region: { ...text, title: 'Region' } }, required: ['region'] } },
          },
          {
            title: 'Other',
            type: 'object',
            required: ['other'],
            properties: { other: { properties: { config: { type: 'object', title: 'Config' } } } },
          },
        ],
      },
    },
  },
  kms: {
    type: 'object',
    properties: {
      sops: {
        title: 'SOPS',
        oneOf: [
          { title: 'None', type: 'object', nullable: true, additionalProperties: false },
          {
            title: 'Age',
            properties: {
              provider: { ...text, enum: ['age'], default: 'age' },
              age: { properties: { publicKey: text, privateKey: text } },
            },
          },
        ],
      },
    },
  },
  obj: {
    type: 'object',
    properties: {
      showWizard: { type: 'boolean' },
      provider: {
        title: 'Object Storage provider',
        oneOf: [
          { title: 'Disabled', properties: { type: { ...text, enum: ['disabled'], default: 'disabled' } } },
          {
            title: 'Linode',
            required: ['linode', 'type'],
            properties: {
              type: { ...text, enum: ['linode'], default: 'linode' },
              linode: { properties: { region: { ...text, title: 'Region' } }, required: ['region'] },
            },
          },
        ],
      },
    },
  },
  ingress: {
    type: 'object',
    properties: {
      platformClass: {
        allOf: [
          { properties: { className: { ...text, default: 'platform' } } },
          { properties: { entrypoint: { ...text, title: 'Entrypoint' } } },
        ],
      },
      classes: {
        title: 'Additional classes',
        type: 'array',
        items: {
          allOf: [
            { properties: { className: { ...text, title: 'Class name' } } },
            { properties: { entrypoint: text } },
          ],
          required: ['className'],
        },
      },
    },
  },
  platformBackups: {
    type: 'object',
    properties: {
      gitea: backupApp,
      database: { properties: { harbor: backupApp, gitea: backupApp, keycloak: backupApp } },
    },
  },
  oidc: {
    type: 'object',
    properties: { issuer: { ...text, title: 'Issuer' }, clientSecret: { ...text, 'x-secret': true } },
  },
  versions: { type: 'object', required: ['version'], properties: { version: { ...text, default: 'latest' } } },
}
const submit = jest.fn()

beforeEach(() => {
  mockSession.appsEnabled = { harbor: true, gitea: true, alertmanager: true }
  mockSession.settings.otomi = { isPreInstalled: false, hasExternalDNS: true }
  submit.mockReset()
  submit.mockReturnValue(false)
  setSpec({ components: { schemas: { Settings: { properties: schemas } } } })
})

const renderSetting = (settingId: string, settings: Record<string, unknown> = {}, objSettings: object = {}) =>
  render(
    <MemoryRouter>
      <Setting settingId={settingId} settings={settings} objSettings={objSettings} onSubmit={submit} mutating={false} />
    </MemoryRouter>,
  )

test('cluster validates input, protects hidden and read-only values, and submits valid updates', () => {
  renderSetting('cluster', { name: 'good', provider: 'linode', k8sContext: 'hidden' })
  expect(screen.queryByLabelText('K8s context')).not.toBeInTheDocument()
  expect(screen.getByLabelText('custom')).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'BAD' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).not.toHaveBeenCalled()
  expect(screen.getByText(/must match pattern/)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'better' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ name: 'better', provider: 'linode', k8sContext: 'hidden' })
})

test('preserves server-provided fields not present in the editable schema', () => {
  renderSetting('cluster', { name: 'good', provider: 'linode', serverField: { keep: true } })
  fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'better' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ name: 'better', provider: 'linode', serverField: { keep: true } })
})

test('alerts show only selected receiver settings and retain unselected values', () => {
  renderSetting('alerts', { receivers: ['slack'], slack: { url: 'secret' }, msteams: { url: 'keep' } })
  expect(screen.getByLabelText('Webhook')).toHaveAttribute('type', 'password')
  expect(screen.queryByText('Microsoft Teams')).not.toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('msteams'))
  expect(screen.getByText('Microsoft Teams')).toBeInTheDocument()
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({
    receivers: ['slack', 'msteams'],
    slack: { url: 'secret' },
    msteams: { url: 'keep' },
  })
})

test('DNS provider switching validates required values and supports arrays', () => {
  renderSetting('dns', { zones: ['example.com'], provider: {} })
  fireEvent.click(screen.getByText('Add Zones'))
  const inputs = screen.getAllByRole('textbox').filter((input) => input.tagName === 'INPUT')
  fireEvent.change(inputs[1], { target: { value: 'example.org' } })
  fireEvent.mouseDown(screen.getByLabelText('Provider'))
  fireEvent.click(screen.getByRole('option', { name: 'AWS' }))
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).not.toHaveBeenCalled()
  expect(screen.getByText(/must have required property 'region'/)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Region *'), { target: { value: 'us-east-1' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({
    zones: ['example.com', 'example.org'],
    provider: { aws: { region: 'us-east-1' } },
  })
})

test('DNS can disable a previously configured provider', () => {
  renderSetting('dns', { provider: { aws: { region: 'us-east-1' } } })
  fireEvent.mouseDown(screen.getByLabelText('Provider'))
  fireEvent.click(screen.getByRole('option', { name: 'None' }))
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ provider: null })
})

test('invalid YAML blocks submission until corrected', () => {
  renderSetting('dns', { provider: { other: { config: { existing: 'value' } } } })
  fireEvent.change(screen.getByLabelText('Config'), { target: { value: 'invalid: [' } })
  expect(screen.getByText('Submit')).toBeDisabled()
  expect(screen.getByLabelText('Config')).toHaveAttribute('aria-invalid', 'true')
  fireEvent.change(screen.getByLabelText('Config'), { target: { value: 'changed: yes' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ provider: { other: { config: { changed: 'yes' } } } })
})

test('YAML editor updates when settings are refreshed', () => {
  const { rerender } = renderSetting('dns', { provider: { other: { config: { existing: 'value' } } } })
  expect(screen.getByLabelText('Config')).toHaveValue('existing: value\n')
  rerender(
    <MemoryRouter>
      <Setting
        settingId='dns'
        settings={{ provider: { other: { config: { refreshed: 'value' } } } }}
        objSettings={{}}
        onSubmit={submit}
        mutating={false}
      />
    </MemoryRouter>,
  )
  expect(screen.getByLabelText('Config')).toHaveValue('refreshed: value\n')
})

test('object storage switches providers and applies the discriminator', () => {
  renderSetting('obj', { showWizard: true, provider: { type: 'disabled' } })
  fireEvent.mouseDown(screen.getByLabelText('Object Storage provider'))
  fireEvent.click(screen.getByRole('option', { name: 'Linode' }))
  fireEvent.change(screen.getByLabelText('Region *'), { target: { value: 'nl-ams' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ showWizard: true, provider: { type: 'linode', linode: { region: 'nl-ams' } } })
})

test('ingress merges allOf fields and disables additional classes without external DNS', () => {
  mockSession.settings.otomi.hasExternalDNS = false
  renderSetting('ingress', { platformClass: { className: 'platform', entrypoint: '1.2.3.4' }, classes: [] })
  expect(screen.getByLabelText('Entrypoint')).toHaveValue('1.2.3.4')
  expect(screen.getByText('Add Additional classes')).toBeDisabled()
  fireEvent.change(screen.getByLabelText('Entrypoint'), { target: { value: '5.6.7.8' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ platformClass: { className: 'platform', entrypoint: '5.6.7.8' }, classes: [] })
})

test('ingress adds and validates additional classes', () => {
  renderSetting('ingress', { platformClass: { className: 'platform' }, classes: [] })
  fireEvent.click(screen.getByText('Add Additional classes'))
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).not.toHaveBeenCalled()
  expect(screen.getByText(/must have required property 'className'/)).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Class name *'), { target: { value: 'external' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({
    platformClass: { className: 'platform' },
    classes: [{ className: 'external' }],
  })
})

test('KMS shows the selected provider and keeps generated Age keys read-only', () => {
  renderSetting('kms', { sops: { provider: 'age', age: { publicKey: 'public', privateKey: 'private' } } })
  expect(screen.getByLabelText('Public key')).toBeDisabled()
  expect(screen.getByLabelText('Private key')).toBeDisabled()
  expect(screen.queryByLabelText('Provider')).not.toBeInTheDocument()
  fireEvent.mouseDown(screen.getByLabelText('SOPS'))
  fireEvent.click(screen.getByRole('option', { name: 'None' }))
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ sops: null })
})

test('preinstalled backup requires object storage and unavailable apps remain disabled', () => {
  mockSession.settings.otomi.isPreInstalled = true
  mockSession.appsEnabled.harbor = false
  renderSetting('platformBackups', { database: { harbor: { enabled: false }, keycloak: { enabled: false } } })
  const harbor = screen.getByText('Harbor').parentElement
  expect(within(harbor).getByLabelText('Enabled')).toBeDisabled()
  const keycloak = screen.getByText('Keycloak').parentElement
  fireEvent.click(within(keycloak).getByLabelText('Enabled'))
  expect(screen.getByText('Database backup requires object storage to be enabled.')).toBeInTheDocument()
  expect(screen.getByText('Submit')).toBeDisabled()
  expect(screen.getByText('Start Object Storage Wizard')).toBeInTheDocument()
})

test.each(['dns', 'kms', 'ingress'])('preinstalled %s is read-only', (settingId) => {
  mockSession.settings.otomi.isPreInstalled = true
  renderSetting(settingId)
  expect(
    screen.getByText('These settings can not be changed when installed by Akamai Connected Cloud.'),
  ).toBeInTheDocument()
  expect(screen.getByText('Submit')).toBeDisabled()
})

test('OIDC keeps credentials masked and submits changes', () => {
  renderSetting('oidc', { issuer: 'old', clientSecret: 'secret' })
  expect(screen.getByLabelText('Client secret')).toHaveAttribute('type', 'password')
  fireEvent.change(screen.getByLabelText('Issuer'), { target: { value: 'new' } })
  fireEvent.click(screen.getByText('Submit'))
  expect(submit).toHaveBeenCalledWith({ issuer: 'new', clientSecret: 'secret' })
})

test('versions applies default values and avoids resetting edits on equivalent refetch', () => {
  const { rerender } = renderSetting('versions', {})
  expect(screen.getByLabelText('Version *')).toHaveValue('latest')
  fireEvent.change(screen.getByLabelText('Version *'), { target: { value: 'v1' } })
  rerender(
    <MemoryRouter>
      <Setting settingId='versions' settings={{}} objSettings={{}} onSubmit={submit} mutating={false} />
    </MemoryRouter>,
  )
  expect(screen.getByLabelText('Version *')).toHaveValue('v1')
})

test('a failed save leaves changes available for retry', async () => {
  submit.mockResolvedValueOnce(false)
  renderSetting('versions', { version: 'v1' })
  fireEvent.change(screen.getByLabelText('Version *'), { target: { value: 'v2' } })
  fireEvent.click(screen.getByText('Submit'))
  await waitFor(() => expect(submit).toHaveBeenCalled())
  expect(screen.getByText('Submit')).toBeEnabled()
})
