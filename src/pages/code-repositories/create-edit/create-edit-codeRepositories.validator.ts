import * as yup from 'yup'

const repoUrlValidation = yup
  .string()
  .test('is-valid-url', 'Invalid URL for the selected git service', function (value) {
    const parentSpec = this.parent
    const gitService = parentSpec?.gitService
    if (!value || !gitService) return true

    if (gitService === 'gitea') return value.startsWith('https://gitea')
    if (gitService === 'github') return /^(https:\/\/github\.com\/.+|git@github\.com:.+\.git)$/.test(value)
    if (gitService === 'gitlab') return /^(https:\/\/gitlab\.com\/.+|git@gitlab\.com:.+\.git)$/.test(value)
    return true
  })
  .test('is-unique', 'Repository URL must be unique.', function (value) {
    const { codeRepoUrls, validateOnSubmit } = (this.options.context || {}) as any
    if (!validateOnSubmit) return true
    if (!value) return true
    return !codeRepoUrls?.some((repoUrl: string) => repoUrl === value)
  })

export const aplCodeRepoApiSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamCodeRepo']).required(),

  spec: yup.object({
    gitService: yup.string().oneOf(['gitea', 'github', 'gitlab']).required(),
    repositoryUrl: repoUrlValidation.required(),
    private: yup.boolean().optional(),
    secret: yup.string().when('private', {
      is: true,
      then: (s) => s.required('Secret is required when private is true.'),
      otherwise: (s) => s.optional(),
    }),
  }),

  metadata: yup.object({
    name: yup
      .string()
      .required('Code repository name is a required field.')
      .min(2, 'Code repository name must be at least 2 characters long.')
      .matches(
        /^[a-z][a-z0-9-]*[a-z0-9]$/,
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      ),
    labels: yup.object({
      'apl.io/teamId': yup.string().required(),
    }),
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
