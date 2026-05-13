import * as yup from 'yup'

const envVarSchema = yup.object({
  name: yup
    .string()
    .required('Environment variable name is required')
    .matches(/^-*[a-zA-Z_][a-zA-Z0-9_-]*$/, 'Invalid environment variable name'),
  value: yup.string().optional(),
})

const commonModeSchema = yup.object({
  repoUrl: yup.string().required('Repository URL is required').url('Invalid repository URL'),
  path: yup.string().optional(),
  revision: yup.string().optional(),
  envVars: yup.array().of(envVarSchema).optional(),
})

const specSchema = yup.object({
  imageName: yup
    .string()
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
        const { buildNames, validateOnSubmit } = (this.options.context || {}) as any
        if (!validateOnSubmit) return true
        const { tag } = this.parent
        const expectedBuildName = `${value}-${tag}`
        return !buildNames?.some((name: string) => name === expectedBuildName)
      },
    ),

  tag: yup
    .string()
    .required('Tag is required')
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
      const { buildNames, validateOnSubmit } = (this.options.context || {}) as any
      if (!validateOnSubmit) return true
      const { imageName } = this.parent
      const expectedBuildName = `${imageName}-${value}`
      return !buildNames?.some((name: string) => name === expectedBuildName)
    }),

  mode: yup
    .object({
      type: yup.string().required('Mode type is required').oneOf(['docker', 'buildpacks'], 'Invalid mode type'),

      docker: yup.mixed().when('type', {
        is: 'docker',
        then: commonModeSchema.required('Docker configuration is required'),
      }),

      buildpacks: yup.mixed().when('type', {
        is: 'buildpacks',
        then: commonModeSchema
          .required('Buildpacks configuration is required')
          .test('Does not contain "./"', '', function (value: any) {
            const { path } = value || {}
            if (path && path.includes('./')) {
              return this.createError({
                path: 'spec.mode.buildpacks.path',
                message: 'Path for Buildpacks cannot contain "./"',
              })
            }
            return true
          }),
      }),
    })
    .required('Mode configuration is required'),

  externalRepo: yup.boolean().optional(),
  secretName: yup.string().min(2, 'Secret name must be at least 2 characters long.').optional(),
  trigger: yup.boolean().optional(),
  scanSource: yup.boolean().optional(),
})

export const aplBuildApiSchema = yup.object({
  kind: yup.string().oneOf(['AplTeamBuild']).required(),

  spec: specSchema.required(),

  metadata: yup.object({
    name: yup.string().optional(),
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
