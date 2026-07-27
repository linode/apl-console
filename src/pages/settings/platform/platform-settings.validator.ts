import * as yup from 'yup'

export const platformSettingsSchema = yup
  .object({
    hasExternalDNS: yup.boolean().required(),
    hasExternalIDP: yup.boolean().required(),
    version: yup.string().required(),

    globalPullSecret: yup
      .object({
        server: yup.string().required(),
        username: yup.string().required(),
        password: yup.string().required(),
        email: yup.string().email().default(''),
      })
      .required(),

    nodeSelector: yup
      .array()
      .of(
        yup
          .object({
            name: yup.string().required(),
            value: yup.string().required(),
          })
          .required(),
      )
      .required(),
  })
  .required()

export type PlatformSettingsFormValues = yup.InferType<typeof platformSettingsSchema>
