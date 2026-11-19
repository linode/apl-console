import { platformSettingsSchema } from './platform-settings.validator'

const validSettings = {
  hasExternalDNS: false,
  hasExternalIDP: false,
  version: 'v1.0.0',
  nodeSelector: [{ name: 'node-role.kubernetes.io/platform', value: 'true' }],
}

describe('platformSettingsSchema', () => {
  it('accepts valid platform settings', async () => {
    await expect(platformSettingsSchema.validate(validSettings)).resolves.toEqual(validSettings)
  })

  it('accepts only the required version without creating a pull secret', async () => {
    await expect(platformSettingsSchema.validate({ version: 'v1.0.0' })).resolves.toEqual({ version: 'v1.0.0' })
  })

  it.each([
    { nodeSelector: [] },
    { nodeSelector: undefined },
    { nodeSelector: [{ name: '' }] },
    { nodeSelector: [{ name: '', value: '' }] },
  ])('accepts optional or incomplete node selectors: %j', async ({ nodeSelector }) => {
    await expect(platformSettingsSchema.validate({ ...validSettings, nodeSelector })).resolves.toEqual({
      ...validSettings,
      nodeSelector,
    })
  })

  it.each([undefined, ''])('rejects invalid version %j', async (version) => {
    await expect(platformSettingsSchema.validate({ ...validSettings, version })).rejects.toMatchObject({
      path: 'version',
    })
  })

  it('does not trim the platform version or node selectors', async () => {
    const settings = {
      version: '  v1.0.0  ',
      nodeSelector: [{ name: '  workload-type  ', value: '  platform  ' }],
    }
    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })
})
