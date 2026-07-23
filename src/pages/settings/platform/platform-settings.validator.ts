import * as yup from 'yup'

export interface PlatformSettingsFormValues {
  hasExternalDNS: boolean
  hasExternalIDP: boolean
  version: string
}

export const platformSettingsSchema: yup.ObjectSchema<PlatformSettingsFormValues> = yup
  .object({
    hasExternalDNS: yup.boolean().required(),
    hasExternalIDP: yup.boolean().required(),
    version: yup.string().trim().required('Version is required'),
  })
  .required()
