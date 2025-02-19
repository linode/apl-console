import { boolean, object, string } from 'yup'

// Custom validation for repositoryUrl
const urlValidation = string().test('is-valid-url', 'Invalid URL for the selected git service', function (value) {
  const { gitService, private: isPrivate } = this.parent
  if (gitService === 'gitea') return value.startsWith('https://gitea')
  if (gitService === 'github') {
    const isValid = /^(https:\/\/github\.com\/.+|git@github\.com:.+\.git)$/.test(value)
    if (value.startsWith('git@github') && !isPrivate)
      return this.createError({ message: 'Private must be selected for SSH URLs' })
    return isValid
  }
  if (gitService === 'gitlab') {
    const isValid = /^(https:\/\/gitlab\.com\/.+|git@gitlab\.com:.+\.git)$/.test(value)
    if (value.startsWith('git@gitlab') && !isPrivate)
      return this.createError({ message: 'Private must be selected for SSH URLs' })
    return isValid
  }
  return true
})

// Main validation
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
