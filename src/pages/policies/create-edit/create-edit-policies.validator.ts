import { GetPolicyApiResponse, GetTeamPoliciesApiResponse } from 'redux/otomiApi'
import * as yup from 'yup'

export const customValuePolicies: ReadonlyArray<keyof GetTeamPoliciesApiResponse> = [
  'allowed-image-repositories',
  'disallow-capabilities',
  'require-labels',
  'restrict-volume-types',
]

export const supportsCustomValues = (policyName: string): boolean =>
  customValuePolicies.some((name) => name === policyName)

export const policySchema = yup.object({
  action: yup
    .mixed<GetPolicyApiResponse['action']>()
    .oneOf(['Audit', 'Enforce'], 'Select a valid policy action')
    .required('Action is required'),
  severity: yup
    .mixed<GetPolicyApiResponse['severity']>()
    .oneOf(['low', 'medium', 'high'], 'Select a valid severity')
    .required('Severity is required'),
  customValues: yup.array().of(yup.string().defined()).optional(),
})

export type PolicyFormValues = yup.InferType<typeof policySchema>
