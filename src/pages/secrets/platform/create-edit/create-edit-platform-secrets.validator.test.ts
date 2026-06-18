import { createSealedSecretApiResponseSchema } from './create-edit-platform-secrets.validator'

const baseSecret = {
  metadata: {
    name: 'valid-name',
    namespace: 'valid-namespace',
  },
  spec: {
    encryptedData: [{ key: 'foo', value: 'bar' }],
    template: {
      type: 'kubernetes.io/opaque',
    },
  },
}

describe('createSealedSecretApiResponseSchema', () => {
  describe('metadata.name', () => {
    test.each(['my-secret', 'a1', 'secret-name-123'])('accepts valid name: %s', async (name) => {
      await expect(
        createSealedSecretApiResponseSchema.validate({
          ...baseSecret,
          metadata: {
            ...baseSecret.metadata,
            name,
          },
        }),
      ).resolves.toBeTruthy()
    })

    test.each([
      '',
      'A-secret',
      '-secret',
      'secret-',
      '.secret',
      'secret.',
      'secret_name',
      'secret name',
      'a'.repeat(251),
    ])('rejects invalid name: %s', async (name) => {
      await expect(
        createSealedSecretApiResponseSchema.validate({
          ...baseSecret,
          metadata: {
            ...baseSecret.metadata,
            name,
          },
        }),
      ).rejects.toThrow()
    })
  })

  describe('metadata.namespace', () => {
    test.each(['namespace', 'team-a', 'a1'])('accepts valid namespace: %s', async (namespace) => {
      await expect(
        createSealedSecretApiResponseSchema.validate({
          ...baseSecret,
          metadata: {
            ...baseSecret.metadata,
            namespace,
          },
        }),
      ).resolves.toBeTruthy()
    })

    test.each(['', 'Namespace', '-namespace', 'namespace-', 'namespace.name', 'namespace_name'])(
      'rejects invalid namespace: %s',
      async (namespace) => {
        await expect(
          createSealedSecretApiResponseSchema.validate({
            ...baseSecret,
            metadata: {
              ...baseSecret.metadata,
              namespace,
            },
          }),
        ).rejects.toThrow()
      },
    )
  })
})
