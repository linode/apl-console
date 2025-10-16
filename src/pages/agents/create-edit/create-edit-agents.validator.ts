import * as yup from 'yup'

// Schema for Agent form validation
export const agentSchema = yup.object({
  kind: yup.string().oneOf(['AkamaiAgent']).required(),
  metadata: yup.object({
    name: yup
      .string()
      .required('Agent name is required')
      .min(2, 'Agent name must be at least 2 characters')
      .matches(
        /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
        'Name must start and end with a lowercase letter or number, and can only contain lowercase letters, numbers, and hyphens',
      ),
  }),
  spec: yup.object({
    foundationModel: yup.string().required('Please select a foundation model'),
    knowledgeBase: yup.string().optional(),
    agentInstructions: yup.string().required('Please enter agent instructions'),
  }),
})
