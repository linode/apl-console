import { array, boolean, number, object, string } from 'yup'

const pathsValidation = array()
  .of(string())
  .test('optional-or-not', 'Paths cannot have empty values if "forwardPath" is enabled or not', function (value) {
    const { forwardPath } = this.parent
    if (forwardPath) if (value.length === 0) return false

    return !value.some((string) => string === '')
  })

const cnameValidation = object({
  domain: string().optional(),
  tlsSecretName: string().optional(),
}).test('both-or-none', 'Both domain and tlsSecretName must be filled or empty', function (value) {
  if (!value) return true // Allow undefined cname object

  const { domain, tlsSecretName } = value

  // If one is filled while the other is empty, return a validation error
  if ((domain && !tlsSecretName) || (!domain && tlsSecretName)) return false

  return true // Valid case
})

const ingressPublicSchema = object({
  ingressClassName: string().optional(),
  tlsPass: boolean().optional(),
  useDefaultHost: boolean().optional(),
  subdomain: string().required(),
  domain: string().required(),
  useCname: boolean().optional(),
  cname: cnameValidation.required(),
  paths: pathsValidation.required(),
  forwardPath: boolean().optional(),
  hasCert: boolean().optional(),
  certSelect: boolean().optional(),
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
})

// Main validation
export const serviceApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  name: string().required('Service name is required'),
  namespace: string().optional(),
  port: number().required('Port is required'),
  ksvc: object({
    predeployed: boolean().optional(),
  }).optional(),
  trafficControl: object({
    enabled: boolean().optional(),
    weightV1: number().when('enabled', {
      is: true,
      then: number().required('WeightV1 is required when "trafficControl" is enabled'),
      otherwise: number().optional(),
    }),
    weightV2: number().when('enabled', {
      is: true,
      then: number().required('WeightV2 is required when "trafficControl" is enabled'),
      otherwise: number().optional(),
    }),
  }).optional(),
  ingress: ingressPublicSchema,
})
