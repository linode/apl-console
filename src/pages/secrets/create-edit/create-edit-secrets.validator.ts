// sealedSecretValidator.ts

import * as yup from 'yup'

// 1) Define the allowed secret types as a const array
export const secretTypes = [
  'kubernetes.io/opaque',
  'kubernetes.io/service-account-token',
  'kubernetes.io/dockercfg',
  'kubernetes.io/dockerconfigjson',
  'kubernetes.io/basic-auth',
  'kubernetes.io/ssh-auth',
  'kubernetes.io/tls',
] as const

// 2) Derive a TypeScript union from that array
export type SecretType = typeof secretTypes[number]

// 3) Schema for each encryptedData entry
const encryptedDataItemSchema = yup.object({
  key: yup.string().required('Encrypted data key is required'),
  value: yup.string().required('Encrypted data value is required'),
})

// 4) Schema for metadata sub-object
const metadataSchema = yup
  .object({
    annotations: yup.array().of(yup.object()).optional().default(undefined),
    finalizers: yup.array().of(yup.string()).optional().default(undefined),
    labels: yup.array().of(yup.object()).optional().default(undefined),
  })
  .optional()
  .default(undefined)

// 5) Main CreateSealedSecretApiResponse schema
export const createSealedSecretApiResponseSchema = yup.object({
  name: yup
    .string()
    .required('Secret name is required')
    .matches(
      /^[a-z](?:-[a-z0-9]+|[a-z0-9])+$/,
      'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
    ),
  namespace: yup.string().optional().default(undefined),
  immutable: yup.boolean().optional().default(undefined),
  type: yup
    .mixed<SecretType>() // ensures TS sees this as one of SecretType
    .oneOf([...secretTypes], 'Secret type must be one of the allowed Kubernetes secret types')
    .required('Secret type is required')
    .default('kubernetes.io/opaque'), // default to 'kubernetes.io/opaque' if not provided
  encryptedData: yup
    .array()
    .of(encryptedDataItemSchema)
    .required('Encrypted data is required')
    .min(1, 'At least one encrypted data entry is required')
    .default(() => [{ key: '', value: '' }]), // default to one empty entry
  metadata: metadataSchema,
})
