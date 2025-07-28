// create-edit-networkPolicies.validator.ts
import * as yup from 'yup'

// 1) Narrowed interfaces for each variant:
export interface IngressRuleType {
  type: 'ingress'
  ingress: {
    toLabelName: string
    toLabelValue: string
    mode: 'AllowAll' | 'AllowOnly'
    allow?: Array<{
      fromNamespace: string
      fromLabelName: string
      fromLabelValue: string
    }>
  }
  egress?: undefined
}

export interface EgressRuleType {
  type: 'egress'
  egress: {
    domain: string
    ports?: Array<{
      number: number
      protocol: 'HTTPS' | 'HTTP' | 'TCP'
    }>
  }
  ingress?: undefined
}

export interface CreateIngressNetpolApiResponse {
  id?: string
  teamId?: string
  name: string
  ruleType: IngressRuleType
}

export interface CreateEgressNetpolApiResponse {
  id?: string
  teamId?: string
  name: string
  ruleType: EgressRuleType
}

// 2) The ingress schema, typed to exactly CreateIngressNetpolApiResponse:
export const createIngressSchema = yup.object({
  id: yup.string().optional(),
  teamId: yup.string().optional(),
  name: yup.string().required('Inbound rule name is required').max(24, 'Name must not exceed 24 characters'),
  ruleType: yup
    .object({
      type: yup.mixed<IngressRuleType['type']>().oneOf(['ingress']).required(),
      ingress: yup
        .object({
          toLabelName: yup.string().required('Target label is required'),
          toLabelValue: yup.string().required('Target label is required'),
          mode: yup
            .mixed<IngressRuleType['ingress']['mode']>()
            .oneOf(['AllowAll', 'AllowOnly'])
            .required('Mode is required'),
          allow: yup
            .array()
            .of(
              yup.object({
                fromNamespace: yup.string(),
                fromLabelName: yup.string(),
                fromLabelValue: yup.string(),
              }),
            )
            .when('mode', {
              is: 'AllowOnly',
              then: (schema) =>
                schema.test(
                  'at-least-one-label',
                  'At least one source label is required',
                  (arr) => Array.isArray(arr) && arr.some((item) => !!item.fromLabelName?.trim()),
                ),
              otherwise: (schema) => schema.notRequired(),
            }),
        })
        .required(),
      egress: yup.mixed().notRequired(),
    })
    .required(),
})

// 3) The egress schema, typed to exactly CreateEgressNetpolApiResponse:
export const createEgressSchema = yup.object({
  id: yup.string().optional(),
  teamId: yup.string().optional(),
  name: yup.string().required('Name is required').max(24, 'Name must not exceed 24 characters'),
  ruleType: yup
    .object({
      type: yup.mixed<EgressRuleType['type']>().oneOf(['egress']).required(),
      egress: yup
        .object({
          domain: yup
            .string()
            .required('Domain is required')
            .matches(/^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/, 'Must be a valid domain'),
          ports: yup
            .array()
            .of(
              yup.object({
                number: yup
                  .number()
                  .typeError('Port must be a number')
                  .required('Port number is required')
                  .min(1, 'Port number must be larger than 1')
                  .max(65535, 'Port numer must be lower than 65535'),
                protocol: yup
                  .mixed<EgressRuleType['egress']['ports'][0]['protocol']>()
                  .oneOf(['HTTPS', 'HTTP', 'TCP'])
                  .required('Protocol is required'),
              }),
            )
            .optional(),
        })
        .required(),
      ingress: yup.mixed().notRequired(),
    })
    .required(),
})
