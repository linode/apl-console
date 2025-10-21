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
    routes: yup
      .array()
      .of(
        yup.object({
          agent: yup.string().required('Agent name is required'),
          condition: yup.string().required('Condition is required'),
          apiUrl: yup.string().required('API URL is required').url('Must be a valid URL'),
          apiKey: yup.string().optional(),
        }),
      )
      .optional(),
    tools: yup
      .array()
      .of(
        yup.object({
          type: yup
            .string()
            .oneOf(['knowledgeBase', 'mcpServer', 'subWorkflow', 'function'], 'Invalid tool type')
            .required('Tool type is required'),
          name: yup.string().required('Tool name is required'),
          description: yup.string().when('type', {
            is: (val: string) => ['mcpServer', 'subWorkflow', 'function'].includes(val),
            then: (schema) => schema.required('Description is required for this tool type'),
            otherwise: (schema) => schema.optional(),
          }),
          apiUrl: yup.string().when('type', {
            is: (val: string) => ['mcpServer', 'subWorkflow', 'function'].includes(val),
            then: (schema) => schema.required('API URL is required for this tool type').url('Must be a valid URL'),
            otherwise: (schema) => schema.optional(),
          }),
          apiKey: yup.string().optional(),
        }),
      )
      .optional(),
  }),
})
