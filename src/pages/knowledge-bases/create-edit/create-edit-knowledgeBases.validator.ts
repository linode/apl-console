import * as yup from 'yup'

// Schema for Knowledge Base form validation
export const knowledgeBaseSchema = yup.object({
  kind: yup.string().oneOf(['AkamaiKnowledgeBase']).required(),
  metadata: yup.object({
    name: yup
      .string()
      .required('Knowledge base name is required')
      .min(2, 'Knowledge base name must be at least 2 characters')
      .matches(
        /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/,
        'Name must start and end with a lowercase letter or number, and can only contain lowercase letters, numbers, and hyphens',
      ),
  }),
  spec: yup.object({
    sourceUrl: yup
      .string()
      .required('Data source URL is required')
      .url('Please enter a valid URL (e.g., https://example.com/vector-db.zip)')
      .matches(/^https?:\/\//, 'Data source must be a valid HTTP or HTTPS URL'),
    modelName: yup.string().required('Please select an embedding model'),
  }),
})
