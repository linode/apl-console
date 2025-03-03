import { array, boolean, number, object, string } from 'yup'

// Custom validation for repositoryUrl
const urlValidation = string().test('is-valid-url', 'Invalid URL for the selected git service', function (value) {
  const { gitService } = this.parent
  if (gitService === 'gitea') return value.startsWith('https://gitea')
  if (gitService === 'github') return /^(https:\/\/github\.com\/.+|git@github\.com:.+\.git)$/.test(value)
  if (gitService === 'gitlab') return /^(https:\/\/gitlab\.com\/.+|git@gitlab\.com:.+\.git)$/.test(value)
  return true
})
const ingressPublicSchema = object({
  ingressClassName: string().optional(),
  tlsPass: boolean().optional(),
  useDefaultHost: boolean().optional(),
  subdomain: string().optional(),
  domain: string().optional(),
  useCname: boolean().optional(),
  cname: object({
    domain: string().optional(),
    tlsSecretName: string().optional(),
  })
    .optional()
    .nullable(),
  paths: array().of(string()).optional(),
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
  name: string().required('Name is required'),
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
