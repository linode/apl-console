import * as yup from 'yup'

const globalPullSecretSchema = yup
  .object({
    username: yup.string().optional(),
    password: yup.string().optional(),
    email: yup.string().email('Enter a valid email address').optional(),
    server: yup.string().optional(),
  })
  .nullable()
  .optional()

const nodeSelectorSchema = yup.object({
  name: yup.string().optional(),
  value: yup.string().optional(),
})

export const platformSettingsSchema = yup
  .object({
    hasExternalDNS: yup.boolean().optional(),
    hasExternalIDP: yup.boolean().optional(),

    version: yup.string().required('Platform version is required'),

    globalPullSecret: globalPullSecretSchema,

    nodeSelector: yup.array().of(nodeSelectorSchema).optional(),
  })
  .required()

export type PlatformSettingsFormValues = yup.InferType<typeof platformSettingsSchema>
