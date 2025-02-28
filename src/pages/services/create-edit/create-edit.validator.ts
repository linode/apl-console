import { array, boolean, mixed, number, object, string } from 'yup'

// Custom validation for repositoryUrl
const urlValidation = string().test('is-valid-url', 'Invalid URL for the selected git service', function (value) {
  const { gitService } = this.parent
  if (gitService === 'gitea') return value.startsWith('https://gitea')
  if (gitService === 'github') return /^(https:\/\/github\.com\/.+|git@github\.com:.+\.git)$/.test(value)
  if (gitService === 'gitlab') return /^(https:\/\/gitlab\.com\/.+|git@gitlab\.com:.+\.git)$/.test(value)
  return true
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
  ingress: mixed().test('is-valid-ingress', 'Invalid ingress format', (value) => {
    if (value === null) return true // Allow null

    if (typeof value !== 'object') return false

    if (value.type === 'cluster') return Object.keys(value).length === 1 // Only `type: 'cluster'` should exist

    if (value.type === 'public') {
      return object({
        type: string().oneOf(['public']).required(),
        ingressClassName: string().optional(),
        tlsPass: boolean().optional(),
        useDefaultHost: boolean().optional(),
        subdomain: string().required('Subdomain is required'),
        domain: string().required('Domain is required'),
        useCname: boolean().optional(),
        cname: object({
          domain: string().optional(),
          tlsSecretName: string().optional(),
        }).optional(),
        paths: array().of(string()).optional(),
        forwardPath: boolean().optional(),
        hasCert: boolean().optional(),
        certSelect: boolean().optional(),
        certName: string().optional(),
        headers: object({
          response: object({
            set: array()
              .of(
                object({
                  name: string().required(),
                  value: string().required(),
                }),
              )
              .optional(),
          }),
        }).optional(),
      }).isValidSync(value)
    }

    return false // If `type` is neither 'cluster' nor 'public'
  }),
})
