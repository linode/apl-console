import { array, boolean, number, object, string } from 'yup'

const pathsValidation = array()
  .of(string())
  .test('optional-or-not', 'Paths cannot have empty values if "forwardPath" is enabled or not', function (paths) {
    const { forwardPath } = this.parent
    if (forwardPath) if (paths.length === 0) return false
    const includesSlash = paths.some((path) => {
      if (path.includes('/')) return true

      return false
    })

    if (includesSlash) {
      return this.createError({
        path: `ingress.paths.root`,
        message: 'Url Paths cannot contain a "/"',
      })
    }
    return !paths.some((string) => string === '')
  })

const cnameValidation = object({
  domain: string().optional(),
  tlsSecretName: string().optional(),
})
  .test('both-or-none', 'Both domain and tlsSecretName must be filled or empty', function (value) {
    if (!value) return true

    const { domain, tlsSecretName } = value
    if (!domain && tlsSecretName === 'empty') return true
    if ((domain && !tlsSecretName) || (!domain && tlsSecretName)) return false

    return true
  })
  .test('domain-format', 'CNAME cannot contain domain suffix', function (value) {
    if (!value) return true
    const { domain } = value
    const domainSuffix = this.options.context?.domainSuffix
    if (domain.includes(domainSuffix)) return false
    return true
  })

// Main validation
export const serviceApiResponseSchema = object({
  kind: string().required().default('AplTeamService'),
  metadata: object({
    name: string().required('Name is required'),
    labels: object({
      'apl.io/teamId': string().required('Team ID is required'),
    }).required(),
  }),
  spec: object({
    namespace: string().optional(),
    port: number().optional(),
    ksvc: object({
      predeployed: boolean().optional(),
    }).optional(),
    trafficControl: object({
      enabled: boolean().optional(),
      weightV1: number().when('enabled', {
        is: true,
        then: number()
          .required('WeightV1 is required when "trafficControl" is enabled')
          .min(0, 'Must be a minimum of 0')
          .max(100, 'Must be a maximum of 100'),
        otherwise: number().optional(),
      }),
      weightV2: number().when('enabled', {
        is: true,
        then: number()
          .required('WeightV2 is required when "trafficControl" is enabled')
          .min(0, 'Must be a minimum of 0')
          .max(100, 'Must be a maximum of 100'),
        otherwise: number().optional(),
      }),
    }).optional(),
    ingressClassName: string().optional(),
    tlsPass: boolean().optional(),
    domain: string().required(),
    useCname: boolean().optional(),
    cname: cnameValidation.required(),
    paths: pathsValidation.required(),
    forwardPath: boolean().optional(),
    hasCert: boolean().optional(),
    certName: string().when('hasCert', {
      is: true,
      then: string().required('Certificate name is required if certificate is selected'),
      otherwise: string().nullable(),
    }),
    headers: object({
      response: object({
        set: array()
          .of(
            object({
              name: string().required('Header name is required'),
              value: string().required('Header value is required'),
            }),
          )
          .optional()
          .nullable(),
      })
        .optional()
        .nullable(),
    })
      .optional()
      .nullable(),
  }),
  status: object({
    conditions: array()
      .of(
        object({
          type: string().optional(),
          status: string().optional(),
          message: string().optional(),
          reason: string().optional(),
          lastTransitionTime: string().optional(),
        }),
      )
      .optional(),
    phase: string().optional(),
  }),
})
