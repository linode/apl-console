import * as yup from 'yup'

export const aplCatalogApiSchema = yup.object({
  kind: yup.string().oneOf(['AplCatalog']).required().default('AplCatalog'),

  spec: yup.object({
    name: yup.string().required('Catalog name is a required field.'),
    branch: yup.string().required('Branch is a required field.'),
    repositoryUrl: yup.string().required('Repository URL is a required field.'),
    enabled: yup.boolean().required('Enabled is a required field.'),
  }),

  metadata: yup.object({
    name: yup
      .string()
      .required('Catalog name is a required field.')
      .min(2, 'Catalog name must be at least 2 characters long.')
      .matches(
        /^[a-z][a-z0-9-]*[a-z0-9]$/,
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      ),
  }),

  status: yup.object({
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
  }),
})
