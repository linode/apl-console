import { boolean, object, string } from 'yup'

// Custom URL validation based on gitService
const urlValidation = string().test('is-valid-url', 'Invalid URL for the selected git service', function (value) {
  const { gitService } = this.parent
  if (gitService === 'gitea') return value.startsWith('https://gitea')
  if (gitService === 'github') return /^https:\/\/github\.com\/.+/.test(value)
  if (gitService === 'gitlab') return /^https:\/\/gitlab\.com\/.+/.test(value)

  return true
})

// Main validation schema for CreateCoderepoApiResponse
export const coderepoApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  label: string()
    .required('Code repository label is a required field.')
    .matches(
      /^[a-z]([-a-z0-9]*[a-z0-9])+$/,
      'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
    ),
  gitService: string().required(),
  repositoryUrl: urlValidation.required(),
  private: boolean().optional(),
  secret: string().when('private', {
    is: true,
    then: string().required('Secret is required when private is true.'),
    otherwise: string().optional(),
  }),
})
