import * as yup from 'yup'

const nodeSelectorSchema = yup.object({
  name: yup.string().optional(),
  value: yup.string().optional(),
})

export const platformSettingsSchema = yup
  .object({
    hasExternalDNS: yup.boolean().optional(),
    hasExternalIDP: yup.boolean().optional(),

    version: yup.string().required('Platform version is required'),

    nodeSelector: yup.array().of(nodeSelectorSchema).optional(),
  })
  .required()

export type PlatformSettingsFormValues = yup.InferType<typeof platformSettingsSchema>
