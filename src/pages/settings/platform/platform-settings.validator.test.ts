import { platformSettingsSchema } from './platform-settings.validator'

const validSettings = {
  hasExternalDNS: false,
  hasExternalIDP: false,
  version: 'v1.0.0',
  globalPullSecret: {
    server: 'docker.io',
    username: 'registry-user',
    password: 'registry-password',
    email: 'registry@example.com',
  },
  nodeSelector: [
    {
      name: 'node-role.kubernetes.io/platform',
      value: 'true',
    },
  ],
}

describe('platformSettingsSchema', () => {
  it('accepts valid platform settings', async () => {
    await expect(platformSettingsSchema.validate(validSettings)).resolves.toEqual(validSettings)
  })

  it('accepts an empty node selector array', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: [],
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('defaults the global pull secret email to an empty string', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: {
        server: 'docker.io',
        username: 'registry-user',
        password: 'registry-password',
      },
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual({
      ...settings,
      globalPullSecret: {
        ...settings.globalPullSecret,
        email: '',
      },
    })
  })

  it.each([
    ['hasExternalDNS', { ...validSettings, hasExternalDNS: undefined }],
    ['hasExternalIDP', { ...validSettings, hasExternalIDP: undefined }],
    ['version', { ...validSettings, version: undefined }],
    ['globalPullSecret', { ...validSettings, globalPullSecret: undefined }],
    ['nodeSelector', { ...validSettings, nodeSelector: undefined }],
  ])('rejects settings when %s is missing', async (_field, settings) => {
    await expect(platformSettingsSchema.validate(settings)).rejects.toBeInstanceOf(Error)
  })

  it.each([
    [
      'server',
      {
        ...validSettings,
        globalPullSecret: {
          ...validSettings.globalPullSecret,
          server: '',
        },
      },
    ],
    [
      'username',
      {
        ...validSettings,
        globalPullSecret: {
          ...validSettings.globalPullSecret,
          username: '',
        },
      },
    ],
    [
      'password',
      {
        ...validSettings,
        globalPullSecret: {
          ...validSettings.globalPullSecret,
          password: '',
        },
      },
    ],
  ])('rejects an empty global pull secret %s', async (_field, settings) => {
    await expect(platformSettingsSchema.validate(settings)).rejects.toBeInstanceOf(Error)
  })

  it('rejects an invalid global pull secret email', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: {
        ...validSettings.globalPullSecret,
        email: 'not-an-email',
      },
    }

    await expect(platformSettingsSchema.validate(settings)).rejects.toMatchObject({
      path: 'globalPullSecret.email',
    })
  })

  it('accepts an empty global pull secret email', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: {
        ...validSettings.globalPullSecret,
        email: '',
      },
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it.each([
    [
      'name',
      {
        ...validSettings,
        nodeSelector: [
          {
            name: '',
            value: 'true',
          },
        ],
      },
    ],
    [
      'value',
      {
        ...validSettings,
        nodeSelector: [
          {
            name: 'node-role.kubernetes.io/platform',
            value: '',
          },
        ],
      },
    ],
  ])('rejects a node selector with an empty %s', async (_field, settings) => {
    await expect(platformSettingsSchema.validate(settings)).rejects.toBeInstanceOf(Error)
  })

  it('reports all validation errors when abortEarly is disabled', async () => {
    const settings = {
      hasExternalDNS: undefined,
      hasExternalIDP: undefined,
      version: '',
      globalPullSecret: {
        server: '',
        username: '',
        password: '',
        email: 'invalid-email',
      },
      nodeSelector: [
        {
          name: '',
          value: '',
        },
      ],
    }

    await expect(
      platformSettingsSchema.validate(settings, {
        abortEarly: false,
      }),
    ).rejects.toMatchObject({
      inner: expect.arrayContaining([
        expect.objectContaining({ path: 'hasExternalDNS' }),
        expect.objectContaining({ path: 'hasExternalIDP' }),
        expect.objectContaining({ path: 'version' }),
        expect.objectContaining({ path: 'globalPullSecret.server' }),
        expect.objectContaining({ path: 'globalPullSecret.username' }),
        expect.objectContaining({ path: 'globalPullSecret.password' }),
        expect.objectContaining({ path: 'globalPullSecret.email' }),
        expect.objectContaining({ path: 'nodeSelector[0].name' }),
        expect.objectContaining({ path: 'nodeSelector[0].value' }),
      ]),
    })
  })
})
