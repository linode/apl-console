import { FieldValues } from 'react-hook-form'
import { resetSettingsMocks, settingsSchemas } from './settings-test-utils'
import { defaultsForSchema } from './settings-schema'
import { getSettingsSchema, settingsPayload, settingsResolver } from './settings.validator'

beforeEach(() => resetSettingsMocks())

const validate = (setting: string, values: FieldValues) =>
  settingsResolver(settingsSchemas[setting])(values, undefined, { fields: {}, shouldUseNativeValidation: false })

test.each([
  ['cluster', { name: 'cluster', provider: 'linode', owner: 'owner' }],
  ['alerts', { receivers: ['slack', 'msteams'], slack: { url: 'secret' }, msteams: { highPrio: 'secret' } }],
  ['dns', { zones: ['example.com'], provider: { aws: { region: 'us-east-1' } } }],
  ['ingress', { classes: [{ className: 'external', entrypoint: '1.2.3.4' }] }],
  ['kms', { sops: { provider: 'aws', aws: { keys: 'key', accessKey: 'key', secretKey: 'secret' } } }],
  [
    'obj',
    { provider: { type: 'linode', linode: { region: 'us-east-1', accessKeyId: 'key', secretAccessKey: 'secret' } } },
  ],
  ['oidc', { issuer: 'https://idp.example.com', clientID: 'client', clientSecret: 'secret' }],
  ['platformBackups', { database: { keycloak: { enabled: true, schedule: '0 0 * * *', retentionPolicy: '7d' } } }],
  ['versions', { version: 'v5.0.0' }],
])('%s accepts valid settings and keeps the submitted values', async (setting: string, values: FieldValues) => {
  const result = await validate(setting, values)
  expect(result.errors).toEqual({})
  expect(result.values).toEqual(values)
})

test.each([
  ['cluster', { name: 'BAD', provider: 'linode' }],
  ['cluster', { name: 'a', provider: 'linode' }],
  ['cluster', { name: 'a'.repeat(64), provider: 'linode' }],
  ['cluster', { name: 'cluster', provider: 'invalid' }],
  ['alerts', { receivers: ['slack', 'slack'] }],
  ['alerts', { receivers: ['invalid'] }],
  ['dns', { zones: ['duplicate', 'duplicate'] }],
  ['dns', { provider: { aws: { region: '' } } }],
  ['dns', { provider: { azure: { resourceGroup: 'only-one-required-field' } } }],
  ['dns', { provider: { cloudflare: { email: 'invalid' } } }],
  ['ingress', { classes: [{ className: '' }] }],
  ['ingress', { platformClass: { entrypoint: 'not-an-ip' } }],
  ['kms', { sops: { provider: 'aws', aws: { keys: 'key' } } }],
  ['kms', { sops: { provider: 'age', age: {} } }],
  [
    'obj',
    { provider: { type: 'linode', linode: { region: 'with space', accessKeyId: 'key', secretAccessKey: 'secret' } } },
  ],
  ['oidc', { issuer: 'invalid', clientID: 'client', clientSecret: 'secret' }],
  ['oidc', { issuer: 'https://idp.example.com', clientID: '', clientSecret: '' }],
  ['platformBackups', { database: { keycloak: { enabled: 'yes' } } }],
  ['versions', { version: '' }],
])('%s rejects invalid field boundaries', async (setting: string, values: FieldValues) => {
  const result = await validate(setting, values)
  expect(Object.keys(result.errors).length).toBeGreaterThan(0)
  expect(result.values).toEqual({})
})

test('preserves unknown API fields and explicit null/empty arrays in payloads', async () => {
  const values = {
    name: 'cluster',
    provider: 'linode',
    serverField: { keep: true },
    optional: '',
    zones: [],
    other: null,
  }
  const result = await validate('cluster', values)
  expect(result.errors).toEqual({})
  expect(settingsPayload(result.values, settingsSchemas.cluster)).toEqual({
    name: 'cluster',
    provider: 'linode',
    serverField: { keep: true },
    zones: [],
    other: null,
  })
})

test('supports explicit provider removal and rejects YAML scalars and arrays', async () => {
  expect((await validate('dns', { provider: null })).errors).toEqual({})
  expect((await validate('kms', { sops: null })).errors).toEqual({})
  await Promise.all(
    ['plain-text', 'null', '[one, two]', 'bad: ['].map(async (value) => {
      const result = await validate('dns', {
        provider: { other: { name: 'custom', 'external-dns': value, 'cert-manager': {} } },
      })
      expect(result.errors).not.toEqual({})
    }),
  )
})

test('defaults preserve hidden and future fields without mutating API data', () => {
  const data = { name: 'cluster', provider: 'linode', k8sContext: 'keep', future: { keep: true } }
  const result = defaultsForSchema(settingsSchemas.cluster, data)
  expect(result).toEqual({ ...data, owner: 'otomi' })
  expect(data).not.toHaveProperty('owner')
})

test('unknown setting schemas fail explicitly', () => {
  expect(() => getSettingsSchema('unknown')).toThrow('Unknown setting schema: unknown')
})

test('a reused resolver validates the active provider after switching choices', async () => {
  const resolver = settingsResolver(settingsSchemas.dns)
  const options = { fields: {}, shouldUseNativeValidation: false }
  expect((await resolver({ provider: { aws: { region: 'us-east-1' } } }, undefined, options)).errors).toEqual({})
  expect((await resolver({ provider: { aws: { region: '' } } }, undefined, options)).errors).not.toEqual({})
  expect((await resolver({ provider: { google: { project: '' } } }, undefined, options)).errors).not.toEqual({})
  expect((await resolver({ provider: null }, undefined, options)).errors).toEqual({})
})
