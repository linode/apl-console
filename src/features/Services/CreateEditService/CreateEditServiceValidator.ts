import { array, boolean, lazy, mixed, number, object, string } from 'yup'

// Define Yup schema for IngressCluster
const ingressClusterSchema = object({
  type: string().oneOf(['cluster']).required(),
})

// Define Yup schema for IngressPublic
const ingressPublicSchema = object({
  type: string().oneOf(['public']).required(),
  ingressClassName: string().optional(),
  tlsPass: boolean().optional(),
  useDefaultHost: boolean().optional(),
  subdomain: string().required('Subdomain is required for public ingress'),
  domain: string().required('Domain is required for public ingress'),
  useCname: boolean().optional(),
  cname: object({
    domain: string().optional(),
    tlsSecretName: string().optional(),
  }).optional(),
  paths: array().of(string()).optional(),
  forwardPath: boolean().optional(),
  hasCert: boolean().optional(),
  certSelect: boolean().optional(),
  certName: string().when('hasCert', {
    is: true,
    then: string().required('Certificate name is required if certificate is selected'),
    otherwise: string().nullable(),
  }),
  certArn: string().optional(),
  headers: object({
    response: object({
      set: array()
        .of(
          object({
            name: string().required('Header name is required'),
            value: string().required('Header value is required'),
          }),
        )
        .optional(),
    }).optional(),
  }).optional(),
})

// Main validation schema for CreateServiceApiResponse
export const createServiceApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  name: string().required('Service name is required'),
  namespace: string().optional(),
  port: number().optional(),
  ksvc: object({
    predeployed: boolean().optional(),
  }).optional(),
  trafficControl: object({
    enabled: boolean().optional(),
    weightV1: number().optional(),
    weightV2: number().optional(),
  }).optional(),
  // Conditional validation for Ingress: either IngressCluster or IngressPublic
  ingress: lazy((value) => {
    switch (value?.type) {
      case 'cluster':
        return ingressClusterSchema
      case 'public':
        return ingressPublicSchema
      default:
        return mixed().required('Ingress type is required and must be either "cluster" or "public"')
    }
  }),
})
