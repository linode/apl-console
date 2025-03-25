import { array, boolean, mixed, object, string } from 'yup'

const envVarSchema = object({
  name: string()
    .required('Environment variable name is required')
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid environment variable name'),
  value: string().required('Environment variable value is required'),
})

const commonModeSchema = object({
  repoUrl: string().required('Repository URL is required').url('Invalid repository URL'),
  path: string().optional(),
  revision: string().optional(),
  envVars: array().of(envVarSchema).optional(),
})

export const buildApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  name: string()
    .optional()
    .matches(
      /^[a-z]([-a-z0-9]*[a-z0-9])+$/,
      'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
    ),
  imageName: string()
    .required('Image name is required')
    .matches(/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/, 'Image name can only contain lowercase letters, numbers, and hyphens.')
    .test(
      'name-matches-build-name',
      'Invalid name. The combined image name and tag must not exceed 128 characters.',
      function (imageName) {
        const { tag } = this.parent
        const expectedBuildName = `${imageName}-${tag}`
        return expectedBuildName.length <= 128
      },
    ),
  tag: string()
    .required('Tag is required')
    .matches(/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/, 'Tag can only contain lowercase letters, numbers, and hyphens.')
    .test(
      'tag-matches-build-name',
      'Invalid name. The combined image name and tag must not exceed 128 characters.',
      function (tag) {
        const { imageName } = this.parent
        const expectedBuildName = `${imageName}-${tag}`
        return expectedBuildName.length <= 128
      },
    ),
  mode: object({
    type: string().required('Mode type is required').oneOf(['docker', 'buildpacks'], 'Invalid mode type'),
    docker: mixed().when('type', {
      is: 'docker',
      then: commonModeSchema.required('Docker configuration is required'),
    }),
    buildpacks: mixed().when('type', {
      is: 'buildpacks',
      then: commonModeSchema.required('Buildpacks configuration is required'),
    }),
  }).required('Mode configuration is required'),
  codeRepoName: string().optional(),
  externalRepo: boolean().optional(),
  secretName: string().optional(),
  trigger: boolean().optional(),
  scanSource: boolean().optional(),
})
