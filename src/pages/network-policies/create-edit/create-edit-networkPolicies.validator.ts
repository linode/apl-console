import * as yup from 'yup'

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

const metadataSchema = yup.object({
  name: yup
    .string()
    .required('Rule name is required')
    .min(2, 'Rule name must be at least 2 characters long.')
    .max(24, 'Rule name must not exceed 24 characters')
    .matches(
      /^[a-z](?:[a-z0-9-]*[a-z0-9])?$/,
      'Rule name must start with a lowercase letter, contain only lowercase letters, numbers, and hyphens, and end with a letter or number',
    ),
  namespace: yup.string().optional(),
  annotations: yup.object().optional(),
  labels: yup.object({
    'apl.io/teamId': yup.string().required(),
  }),
})

const statusSchema = yup.object({
  conditions: yup
    .array(
      yup.object({
        lastTransitionTime: yup.string().optional(),
        message: yup.string().optional(),
        reason: yup.string().optional(),
        status: yup.boolean().optional(),
        type: yup.string().optional(),
      }),
    )
    .optional(),
  phase: yup.string().optional(),
})

export const createAplIngressSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamNetworkControl']).required(),

  spec: yup
    .object({
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
    .required(),

  metadata: metadataSchema.required(),
  status: statusSchema.required(),
})

export const createAplEgressSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamNetworkControl']).required(),

  spec: yup
    .object({
      ruleType: yup
        .object({
          type: yup.mixed<EgressRuleType['type']>().oneOf(['egress']).required(),
          egress: yup
            .object({
              domain: yup.string().required('Domain name or IP address is required'),
              ports: yup
                .array()
                .of(
                  yup.object({
                    number: yup
                      .number()
                      .typeError('Port number must be a number')
                      .required('Port number is required')
                      .min(1, 'Port number must be at least 1')
                      .max(65535, 'Port number must not exceed 65535'),
                    protocol: yup
                      .mixed<'HTTPS' | 'HTTP' | 'TCP'>()
                      .oneOf(['HTTPS', 'HTTP', 'TCP'])
                      .required('Protocol is required'),
                  }),
                )
                .min(1, 'At least one port is required')
                .required('At least one port is required'),
            })
            .required(),
          ingress: yup.mixed().notRequired(),
        })
        .required(),
    })
    .required(),

  metadata: metadataSchema.required(),
  status: statusSchema.required(),
})
