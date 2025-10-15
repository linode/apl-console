import { array, boolean, mixed, object, string } from 'yup'

const envVarSchema = object({
  name: string()
    .required('Environment variable name is required')
    .matches(/^-*[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid environment variable name'),
  value: string().optional(),
})

const commonModeSchema = object({
  repoUrl: string()
    .required('Repository URL is required')
    .test('is-valid-git-url', 'Invalid repository URL', (value) => {
      if (!value) return false
      // Check for SSH format: git@host:path or user@host:path
      const sshPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+:[a-zA-Z0-9/._-]+$/
      // Check for HTTP(S) URL format
      const httpPattern = /^https?:\/\/.+/
      return sshPattern.test(value) || httpPattern.test(value)
    }),
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
      'Invalid container image name, the combined image name and tag must not exceed 128 characters.',
      function (imageName) {
        const { tag } = this.parent
        const expectedBuildName = `${imageName}-${tag}`
        return expectedBuildName.length <= 128
      },
    )
    .min(2, 'Image name must be at least 2 characters')
    .max(128, 'Image name must not exceed 128 characters')
    .test(
      'is-unique',
      'Container image name already exists, the combined image name and tag must be unique.',
      function (value) {
        const { buildNames, validateOnSubmit } = this.options.context || {}
        // Only validate uniqueness if `validateOnSubmit` is true
        if (!validateOnSubmit) return true
        const { tag } = this.parent
        const expectedBuildName = `${value}-${tag}`
        return !buildNames.some((name) => name === expectedBuildName)
      },
    ),
  tag: string()
    .required('Tag is required')
    // https://pkg.go.dev/github.com/distribution/reference#pkg-overview
    .matches(
      /^[\w][\w.-]{0,127}$/,
      'Tag must start with a letter, digit, or underscore, and can include dots, hyphens, underscores.',
    )
    .test('tag-matches-build-name', '', function (tag) {
      const { imageName } = this.parent
      const expectedBuildName = `${imageName}-${tag}`
      return expectedBuildName.length <= 128
    })
    .test('is-unique', '', function (value) {
      const { buildNames, validateOnSubmit } = this.options.context || {}
      // Only validate uniqueness if `validateOnSubmit` is true
      if (!validateOnSubmit) return true
      const { imageName } = this.parent
      const expectedBuildName = `${imageName}-${value}`
      return !buildNames.some((name) => name === expectedBuildName)
    }),
  mode: object({
    type: string().required('Mode type is required').oneOf(['docker', 'buildpacks'], 'Invalid mode type'),
    docker: mixed().when('type', {
      is: 'docker',
      then: commonModeSchema.required('Docker configuration is required'),
    }),
    buildpacks: mixed().when('type', {
      is: 'buildpacks',
      then: commonModeSchema
        .required('Buildpacks configuration is required')
        .test('Does not contain "./"', '', function (value) {
          const { path } = value
          if (path && path.includes('./')) {
            return this.createError({
              path: 'mode.buildpacks.path',
              message: 'Path for Buildpacks cannot contain "./"',
            })
          }

          return true
        }),
    }),
  }).required('Mode configuration is required'),
  codeRepoName: string().optional(),
  externalRepo: boolean().optional(),
  secretName: string().min(2, 'Secret name must be at least 2 characters long.').optional(),
  trigger: boolean().optional(),
  scanSource: boolean().optional(),
})
