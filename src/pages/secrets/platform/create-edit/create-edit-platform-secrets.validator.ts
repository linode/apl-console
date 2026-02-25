import * as yup from 'yup'

export const secretTypes = [
  'kubernetes.io/opaque',
  'Opaque',
  'kubernetes.io/dockercfg',
  'kubernetes.io/dockerconfigjson',
  'kubernetes.io/basic-auth',
  'kubernetes.io/ssh-auth',
  'kubernetes.io/tls',
] as const

export type SecretType = typeof secretTypes[number]

export const createSealedSecretApiResponseSchema = yup.object({
  metadata: yup.object({
    name: yup
      .string()
      .required('Secret name is required')
      .min(2, 'Secret name must be at least 2 characters long.')
      .matches(
        /^[a-z](?:[a-z0-9-]*[a-z0-9])?$/,
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      ),
    namespace: yup
      .string()
      .required('Namespace is required')
      .min(2, 'Namespace must be at least 2 characters long.')
      .matches(
        /^[a-z](?:[a-z0-9-]*[a-z0-9])?$/,
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      ),
  }),

  spec: yup.object({
    encryptedData: yup
      .array()
      .of(
        yup.object({
          key: yup.string().required('Encrypted data key is required'),
          value: yup.string().required('Encrypted data value is required'),
        }),
      )
      .required('Encrypted data is required')
      .min(1, 'At least one encrypted data entry is required')
      .default(() => [{ key: '', value: '' }]),
    template: yup
      .object({
        type: yup
          .mixed<SecretType>()
          .oneOf([...secretTypes], 'Secret type must be one of the allowed Kubernetes secret types')
          .required('Secret type is required')
          .default('kubernetes.io/opaque'),
        immutable: yup.boolean().optional().default(undefined),
        metadata: yup
          .object({
            annotations: yup.array().of(yup.object()).optional().default(undefined),
            finalizers: yup.array().of(yup.string()).optional().default(undefined),
            labels: yup.array().of(yup.object()).optional().default(undefined),
          })
          .optional()
          .default(undefined),
      })
      .required(),
  }),
})
