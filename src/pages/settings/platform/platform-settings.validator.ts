import * as yup from 'yup'

export interface GlobalPullSecretFormValues {
  username: string
  password: string
  email: string
  server: string
}

export interface NodeSelectorFormValue {
  name: string
  value: string
}

export interface PlatformSettingsFormValues {
  hasExternalDNS: boolean
  hasExternalIDP: boolean
  version: string
  globalPullSecret: GlobalPullSecretFormValues
  nodeSelector: NodeSelectorFormValue[]
}

const globalPullSecretSchema: yup.ObjectSchema<GlobalPullSecretFormValues> = yup
  .object({
    username: yup.string().trim().default(''),
    password: yup.string().default(''),
    email: yup.string().trim().email('Enter a valid email address').default(''),
    server: yup.string().trim().default('docker.io'),
  })
  .required()

const nodeSelectorSchema: yup.ObjectSchema<NodeSelectorFormValue> = yup
  .object({
    name: yup.string().trim().required('Label name is required'),
    value: yup.string().trim().required('Label value is required'),
  })
  .required()

export const platformSettingsSchema: yup.ObjectSchema<PlatformSettingsFormValues> = yup
  .object({
    hasExternalDNS: yup.boolean().required(),
    hasExternalIDP: yup.boolean().required(),
    version: yup.string().trim().required('Version is required'),
    globalPullSecret: globalPullSecretSchema,
    nodeSelector: yup.array().of(nodeSelectorSchema).required(),
  })
  .required()
