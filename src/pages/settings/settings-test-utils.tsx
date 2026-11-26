import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { setSpec } from 'common/api-spec'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { SettingsSchema } from './settings-schema'

export const mockEdit = jest.fn()
export const mockRefetch = jest.fn()
export const mockRefetchSettings = jest.fn()
export const mockPush = jest.fn()
export const mockSuccess = jest.fn()
export const mockError = jest.fn()
export const mockSession = {
  appsEnabled: { harbor: true, gitea: true, alertmanager: true },
  settings: { otomi: { isPreInstalled: false, hasExternalDNS: true } },
}
export const mockQuery = {
  data: {} as GetSettingsApiResponse,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: mockRefetch,
}
export const mockMutation = { isLoading: false }
export const mockGlobal = { isDirty: undefined as boolean | undefined }

jest.mock('yaml', () =>
  jest.requireActual(require.resolve('yaml/package.json').replace('package.json', 'dist/index.js')),
)
jest.mock('providers/Session', () => ({
  useSession: () => ({ ...mockSession, refetchSettings: mockRefetchSettings }),
}))
jest.mock('redux/hooks', () => ({ useAppSelector: () => mockGlobal.isDirty }))
jest.mock('redux/otomiApi', () => ({
  useGetSettingsQuery: () => mockQuery,
  useEditSettingsMutation: () => [mockEdit, mockMutation],
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({ push: mockPush }),
}))
jest.mock('utils/snack', () => ({
  __esModule: true,
  default: { success: (...args: unknown[]) => mockSuccess(...args), error: (...args: unknown[]) => mockError(...args) },
}))
jest.mock('layouts/Paper', () => ({
  __esModule: true,
  default: ({ comp, loading }: { comp: React.ReactNode; loading?: boolean }) =>
    loading ? <div>Loading settings</div> : <div>{comp}</div>,
}))
jest.mock('components/LandingHeader', () => ({
  LandingHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}))
jest.mock('components/Section', () => ({
  __esModule: true,
  default: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  ),
}))
jest.mock('components/InformationBanner', () => ({
  __esModule: true,
  default: ({ message, children }: { message: string; children: React.ReactNode }) => (
    <aside>
      {message}
      {children}
    </aside>
  ),
}))
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  MenuItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
  ),
}))
jest.mock('components/forms/TextField', () => ({
  TextField: React.forwardRef<
    HTMLInputElement,
    {
      name?: string
      label: string
      inputId?: string
      value?: string
      onChange?: React.ChangeEventHandler
      disabled?: boolean
      type?: string
      errorText?: string
      select?: boolean
      multiline?: boolean
      children?: React.ReactNode
      error?: boolean
      width?: string
      helperText?: string
      minRows?: number
      SelectProps?: { SelectDisplayProps?: { 'aria-label'?: string } }
    }
  >(
    (
      {
        label,
        inputId,
        errorText,
        select,
        multiline,
        children,
        error,
        width: _width,
        helperText,
        minRows,
        SelectProps,
        ...props
      },
      ref,
    ) => (
      <div style={{ width: _width === 'fullwidth' ? '100%' : undefined }}>
        <label htmlFor={inputId}>{label}</label>
        {select && (
          <select id={inputId} aria-label={SelectProps?.SelectDisplayProps?.['aria-label']} {...props}>
            {children}
          </select>
        )}
        {!select && multiline && <textarea id={inputId} rows={minRows} aria-invalid={Boolean(error)} {...props} />}
        {!select && !multiline && <input ref={ref} id={inputId} aria-invalid={Boolean(error)} {...props} />}
        {errorText && <span role='alert'>{errorText}</span>}
        {helperText && <span>{helperText}</span>}
      </div>
    ),
  ),
}))
jest.mock('components/forms/ControlledCheckbox', () => ({
  __esModule: true,
  default: function MockCheckbox({ name, label, disabled }: { name: string; label: string; disabled?: boolean }) {
    const { useController } = jest.requireActual('react-hook-form')
    const { field } = useController({ name, defaultValue: false })
    return (
      <label htmlFor={name}>
        <input
          id={name}
          type='checkbox'
          checked={Boolean(field.value)}
          disabled={disabled}
          onChange={(event) => field.onChange(event.target.checked)}
        />
        {label}
      </label>
    )
  },
}))

const text: SettingsSchema = { type: 'string' }
const required = (properties: Record<string, SettingsSchema>, keys: string[]): SettingsSchema => ({
  type: 'object',
  properties,
  required: keys,
})
const off: SettingsSchema = { title: 'None', type: 'object', nullable: true, additionalProperties: false }
const backup: SettingsSchema = {
  properties: {
    enabled: { type: 'boolean', default: false },
    schedule: { ...text, default: '0 0 * * *' },
    retentionPolicy: { ...text, default: '7d' },
  },
}
const azureDns = required(
  {
    resourceGroup: text,
    hostedZoneName: text,
    tenantId: text,
    subscriptionId: text,
    aadClientId: text,
    aadClientSecret: text,
  },
  ['resourceGroup', 'tenantId', 'subscriptionId', 'aadClientId', 'aadClientSecret'],
)
const ingressParameters: SettingsSchema = {
  properties: {
    loadBalancerIP: text,
    entrypoint: { ...text, pattern: '^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$' },
    annotations: { type: 'array', items: { properties: { key: text, value: text } } },
  },
}
export const settingsSchemas: Record<string, SettingsSchema> = {
  cluster: {
    additionalProperties: false,
    'x-externalDocsPath': 'cluster-settings',
    ...required(
      {
        name: { ...text, pattern: '^[a-z][a-z0-9-]*[a-z0-9]$', minLength: 2, maxLength: 63 },
        provider: { ...text, enum: ['linode', 'custom'] },
        apiServer: { ...text, pattern: '^https?://' },
        domainSuffix: text,
        owner: { ...text, default: 'otomi' },
        k8sContext: text,
        defaultStorageClass: text,
      },
      ['name', 'provider'],
    ),
  },
  alerts: {
    properties: {
      repeatInterval: { ...text, default: '3h' },
      groupInterval: { ...text, default: '5m' },
      receivers: { type: 'array', uniqueItems: true, items: { ...text, enum: ['slack', 'msteams', 'none'] } },
      slack: {
        properties: {
          channel: { ...text, default: 'mon-apl' },
          channelCrit: { ...text, default: 'mon-apl-crit' },
          url: text,
        },
      },
      msteams: { properties: { highPrio: text, lowPrio: text } },
    },
  },
  oidc: required(
    {
      issuer: { ...text, pattern: '^https?://' },
      clientID: text,
      clientSecret: text,
      platformAdminGroupID: text,
      allTeamsAdminGroupID: text,
      teamAdminGroupID: text,
      // eslint-disable-next-line no-template-curly-in-string
      usernameClaimMapper: { ...text, default: '${CLAIM.upn}' },
      subClaimMapper: { ...text, default: 'sub' },
    },
    ['issuer', 'clientID', 'clientSecret'],
  ),
  versions: required({ version: { ...text, default: 'latest' } }, ['version']),
  platformBackups: {
    properties: { gitea: backup, database: { properties: { harbor: backup, gitea: backup, keycloak: backup } } },
  },
  ingress: {
    properties: {
      platformClass: { allOf: [{ properties: { className: { ...text, default: 'platform' } } }, ingressParameters] },
      classes: {
        type: 'array',
        items: { allOf: [{ properties: { className: text } }, ingressParameters], required: ['className'] },
      },
    },
  },
  obj: {
    properties: {
      showWizard: { type: 'boolean', default: true },
      provider: {
        oneOf: [
          { properties: { type: { ...text, enum: ['disabled'], default: 'disabled' } } },
          required(
            {
              type: { ...text, enum: ['linode'], default: 'linode' },
              linode: required(
                {
                  region: { ...text, pattern: '^[^\\s]+$' },
                  accessKeyId: { ...text, pattern: '^[^\\s]+$' },
                  secretAccessKey: { ...text, pattern: '^[^\\s]+$' },
                  buckets: {
                    properties: {
                      loki: { ...text, default: 'loki' },
                      cnpg: { ...text, default: 'cnpg' },
                      harbor: { ...text, default: 'harbor' },
                      gitea: { ...text, default: 'gitea' },
                      'kubeflow-pipelines': { ...text, default: 'kubeflow-pipelines' },
                    },
                  },
                },
                ['region', 'accessKeyId', 'secretAccessKey'],
              ),
            },
            ['type', 'linode'],
          ),
        ],
      },
    },
  },
  kms: {
    properties: {
      sops: {
        oneOf: [
          off,
          required(
            {
              provider: { ...text, default: 'age', enum: ['age'] },
              age: required({ publicKey: text, privateKey: text }, ['publicKey', 'privateKey']),
            },
            ['age'],
          ),
          required(
            {
              provider: { ...text, default: 'aws', enum: ['aws'] },
              aws: required({ keys: text, accessKey: text, secretKey: text, region: text }, [
                'keys',
                'accessKey',
                'secretKey',
              ]),
            },
            ['aws'],
          ),
          required(
            {
              provider: { ...text, default: 'azure', enum: ['azure'] },
              azure: required({ keys: text, clientId: text, clientSecret: text, tenantId: text }, [
                'keys',
                'clientId',
                'clientSecret',
              ]),
            },
            ['azure'],
          ),
          required(
            {
              provider: { ...text, default: 'google', enum: ['google'] },
              google: required({ keys: text, accountJson: text, project: text }, ['keys', 'accountJson', 'project']),
            },
            ['google'],
          ),
        ],
      },
    },
  },
  dns: {
    properties: {
      zones: { type: 'array', uniqueItems: true, items: text },
      domainFilters: { type: 'array', items: text },
      zoneIdFilters: { type: 'array', items: text },
      provider: {
        oneOf: [
          off,
          {
            properties: {
              akamai: required({ host: text, accessToken: text, clientToken: text, clientSecret: text }, [
                'host',
                'accessToken',
                'clientToken',
                'clientSecret',
              ]),
            },
          },
          required(
            {
              aws: required(
                { region: text, role: text, credentials: { properties: { accessKey: text, secretKey: text } } },
                ['region'],
              ),
            },
            ['aws'],
          ),
          required({ azure: azureDns }, ['azure']),
          required({ 'azure-private-dns': azureDns }, ['azure-private-dns']),
          required(
            {
              cloudflare: {
                properties: {
                  apiToken: text,
                  apiSecret: text,
                  email: { ...text, format: 'email' },
                  proxied: { type: 'boolean', default: true },
                },
              },
            },
            ['cloudflare'],
          ),
          required({ digitalocean: { properties: { apiToken: text } } }, ['digitalocean']),
          required({ linode: { properties: { apiToken: text } } }, ['linode']),
          required({ google: required({ project: text, serviceAccountKey: text }, ['project']) }, ['google']),
          required(
            {
              other: required({ name: text, 'external-dns': { type: 'object' }, 'cert-manager': { type: 'object' } }, [
                'name',
                'external-dns',
                'cert-manager',
              ]),
            },
            ['other'],
          ),
        ],
      },
    },
  },
}

export function resetSettingsMocks(data: GetSettingsApiResponse = {}) {
  jest.clearAllMocks()
  mockEdit.mockResolvedValue({ data: undefined })
  mockQuery.data = data
  mockQuery.isLoading = false
  mockQuery.isFetching = false
  mockQuery.isError = false
  mockMutation.isLoading = false
  mockGlobal.isDirty = undefined
  mockSession.appsEnabled = { harbor: true, gitea: true, alertmanager: true }
  mockSession.settings.otomi = { isPreInstalled: false, hasExternalDNS: true }
  localStorage.clear()
  setSpec({ components: { schemas: { Settings: { properties: settingsSchemas } } } })
}

export function renderSettingsPage(Page: React.ComponentType) {
  return render(<Page />, { wrapper: MemoryRouter })
}

export function change(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

export async function save() {
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))
  await waitFor(() => expect(mockEdit).toHaveBeenCalled())
}
