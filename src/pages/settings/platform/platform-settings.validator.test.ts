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

  it('accepts only the required version field', async () => {
    const settings = {
      version: 'v1.0.0',
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual({
      version: 'v1.0.0',
      globalPullSecret: {
        server: undefined,
        username: undefined,
        password: undefined,
        email: undefined,
      },
    })
  })

  it('accepts an empty node selector array', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: [],
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('accepts an omitted node selector', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: undefined,
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual({
      hasExternalDNS: false,
      hasExternalIDP: false,
      version: 'v1.0.0',
      globalPullSecret: validSettings.globalPullSecret,
    })
  })

  it('accepts a null global pull secret', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: null,
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('casts an omitted global pull secret to an object with undefined fields', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: undefined,
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual({
      hasExternalDNS: false,
      hasExternalIDP: false,
      version: 'v1.0.0',
      globalPullSecret: {
        server: undefined,
        username: undefined,
        password: undefined,
        email: undefined,
      },
      nodeSelector: validSettings.nodeSelector,
    })
  })

  it('accepts missing global pull secret fields', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: {},
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('accepts a missing global pull secret email', async () => {
    const settings = {
      ...validSettings,
      globalPullSecret: {
        server: 'docker.io',
        username: 'registry-user',
        password: 'registry-password',
      },
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
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

  it.each([
    ['missing', undefined],
    ['empty', ''],
  ])('rejects a %s version', async (_case, version) => {
    const settings = {
      ...validSettings,
      version,
    }

    await expect(platformSettingsSchema.validate(settings)).rejects.toMatchObject({
      path: 'version',
    })
  })

  it('does not trim the platform version', async () => {
    const settings = {
      ...validSettings,
      version: '  v1.0.0  ',
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('accepts empty node selector fields because the API fields are optional', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: [
        {
          name: '',
          value: '',
        },
      ],
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('accepts an incomplete node selector', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: [
        {
          name: 'workload-type',
        },
      ],
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('does not trim node selector names and values', async () => {
    const settings = {
      ...validSettings,
      nodeSelector: [
        {
          name: '  workload-type  ',
          value: '  platform  ',
        },
      ],
    }

    await expect(platformSettingsSchema.validate(settings)).resolves.toEqual(settings)
  })

  it('reports all actual validation errors when abortEarly is disabled', async () => {
    const settings = {
      version: '',
      globalPullSecret: {
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
        expect.objectContaining({
          path: 'version',
        }),
        expect.objectContaining({
          path: 'globalPullSecret.email',
        }),
      ]),
    })
  })
})
