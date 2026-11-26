import { fireEvent, screen, waitFor } from '@testing-library/react'
import { change, mockEdit, mockSession, renderSettingsPage, resetSettingsMocks, save } from '../settings-test-utils'
import DnsSettingsPage from './DnsSettingsPage'

beforeEach(() => resetSettingsMocks({ dns: { zones: ['example.com'], provider: { aws: { region: 'us-east-1' } } } }))

test('switches DNS providers, edits zone/filter lists and clears stale credentials', async () => {
  renderSettingsPage(DnsSettingsPage)
  fireEvent.click(screen.getByRole('button', { name: 'Add Zone' }))
  change('Zone 2', 'example.org')
  fireEvent.click(screen.getByRole('button', { name: 'Remove Zone 1' }))
  fireEvent.click(screen.getByRole('button', { name: 'Add Domain filter' }))
  change('Domain filter 1', 'example.org')
  fireEvent.click(screen.getByRole('button', { name: 'Add Zone ID filter' }))
  change('Zone ID filter 1', 'zone-id')
  change('Provider', 'linode')
  change('API token', 'token')
  expect(screen.getByLabelText('API token')).toHaveAttribute('type', 'password')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'dns',
    body: {
      dns: {
        zones: ['example.org'],
        domainFilters: ['example.org'],
        zoneIdFilters: ['zone-id'],
        provider: { linode: { apiToken: 'token' } },
      },
    },
  })
})

test('disabling DNS submits null and retains zone settings', async () => {
  renderSettingsPage(DnsSettingsPage)
  change('Provider', '')
  await save()
  expect(mockEdit).toHaveBeenCalledWith({
    settingId: 'dns',
    body: {
      dns: {
        zones: ['example.com'],
        domainFilters: [],
        zoneIdFilters: [],
        provider: null,
      },
    },
  })
})

test.each([
  [
    'akamai',
    ['Akamai API host', 'Access token', 'Client token', 'Client secret'],
    { akamai: { host: 'value', accessToken: 'value', clientToken: 'value', clientSecret: 'value' } },
  ],
  [
    'azure',
    ['Resource group', 'Tenant ID', 'Subscription ID', 'Client ID', 'Client secret'],
    {
      azure: {
        resourceGroup: 'value',
        tenantId: 'value',
        subscriptionId: 'value',
        aadClientId: 'value',
        aadClientSecret: 'value',
      },
    },
  ],
  [
    'azure-private-dns',
    ['Resource group', 'Tenant ID', 'Subscription ID', 'Client ID', 'Client secret'],
    {
      'azure-private-dns': {
        resourceGroup: 'value',
        tenantId: 'value',
        subscriptionId: 'value',
        aadClientId: 'value',
        aadClientSecret: 'value',
      },
    },
  ],
  ['google', ['Project', 'Service account key'], { google: { project: 'value', serviceAccountKey: 'value' } }],
  ['digitalocean', ['API token'], { digitalocean: { apiToken: 'value' } }],
  ['cloudflare', ['API token', 'API secret'], { cloudflare: { apiToken: 'value', apiSecret: 'value', proxied: true } }],
])('renders and saves explicit %s fields', async (provider: string, labels: string[], expected: object) => {
  renderSettingsPage(DnsSettingsPage)
  change('Provider', provider)
  labels.forEach((label) => change(label, 'value'))
  await save()
  expect(mockEdit.mock.calls[0][0].body.dns.provider).toEqual(expected)
})

test('validates required AWS fields after switching providers', async () => {
  renderSettingsPage(DnsSettingsPage)
  change('Region', '')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findByRole('alert')).toHaveTextContent("must have required property 'region'")
  expect(mockEdit).not.toHaveBeenCalled()
  change('Region', 'eu-west-1')
  await save()
  expect(mockEdit.mock.calls[0][0].body.dns.provider).toEqual({ aws: { region: 'eu-west-1' } })
})

test('validates custom YAML and submits objects rather than editor strings', async () => {
  renderSettingsPage(DnsSettingsPage)
  change('Provider', 'other')
  change('Provider name', 'custom')
  change('YAML for external-dns', 'invalid: [')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  expect(await screen.findByRole('alert')).toBeInTheDocument()
  expect(mockEdit).not.toHaveBeenCalled()
  change('YAML for external-dns', '- list-not-object')
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Enter a YAML object'))
  change('YAML for external-dns', 'token: value')
  change('YAML for cert-manager', 'apiKey:\n  secretRef: key')
  await save()
  expect(mockEdit.mock.calls[0][0].body.dns.provider).toEqual({
    other: {
      name: 'custom',
      'external-dns': { token: 'value' },
      'cert-manager': { apiKey: { secretRef: 'key' } },
    },
  })
})

test('preinstalled DNS settings are read-only', () => {
  mockSession.settings.otomi.isPreInstalled = true
  renderSettingsPage(DnsSettingsPage)
  expect(screen.getByLabelText('Provider')).toBeDisabled()
  expect(screen.getByLabelText('Region')).toBeDisabled()
  expect(screen.getByRole('button', { name: 'Save Changes' })).toBeDisabled()
})

test.each([
  ['aws', 'Access key'],
  ['azure', 'Client ID'],
  ['azure-private-dns', 'Client ID'],
])('%s credentials retain their secret masking', (provider, label) => {
  renderSettingsPage(DnsSettingsPage)
  change('Provider', provider)
  expect(screen.getByLabelText(label)).toHaveAttribute('type', 'password')
})
