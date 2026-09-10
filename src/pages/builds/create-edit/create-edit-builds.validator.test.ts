import { ValidationError } from 'yup'
import { aplBuildApiSchema } from './create-edit-builds.validator'

const createValidBuild = () => ({
  kind: 'AplTeamBuild',
  metadata: {
    name: 'example-build',
    labels: {
      'apl.io/teamId': 'team-a',
    },
  },
  spec: {
    imageName: 'example-image',
    tag: 'latest',
    mode: {
      type: 'docker',
      docker: {
        repoUrl: 'https://github.com/example/repository',
        path: 'Dockerfile',
        revision: 'main',
        envVars: [
          {
            name: 'NODE_ENV',
            value: 'production',
          },
        ],
      },
    },
    externalRepo: false,
    secretName: 'registry-secret',
    trigger: true,
    scanSource: true,
  },
  status: {
    conditions: [],
    phase: 'Ready',
  },
})

type Build = ReturnType<typeof createValidBuild>

interface ValidationContext {
  buildNames?: string[]
  validateOnSubmit?: boolean
}

const validate = (value: Build, context?: ValidationContext) =>
  aplBuildApiSchema.validate(value, {
    abortEarly: false,
    context,
  })

const getValidationErrors = async (value: Build, context?: ValidationContext): Promise<ValidationError[]> => {
  try {
    await validate(value, context)
    throw new Error('Expected schema validation to fail')
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error

    return error.inner.length > 0 ? error.inner : [error]
  }
}

describe('aplBuildApiSchema', () => {
  describe('valid build', () => {
    it('accepts a valid Docker build', async () => {
      await expect(validate(createValidBuild())).resolves.toBeDefined()
    })

    it('accepts a valid Buildpacks build', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          path: 'services/frontend',
          revision: 'main',
          envVars: [],
        },
      } as unknown as typeof build.spec.mode

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows optional fields to be omitted', async () => {
      const build = createValidBuild()

      delete build.metadata.name
      delete build.status
      delete build.spec.externalRepo
      delete build.spec.secretName
      delete build.spec.trigger
      delete build.spec.scanSource

      build.spec.mode.docker = {
        repoUrl: 'https://github.com/example/repository',
        path: 'services/frontend',
        revision: 'main',
        envVars: [],
      }

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('kind', () => {
    it('requires kind', async () => {
      const build = createValidBuild()
      delete build.kind

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'kind',
          }),
        ]),
      )
    })

    it('only accepts AplTeamBuild', async () => {
      const build = createValidBuild()
      build.kind = 'InvalidKind'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'kind',
          }),
        ]),
      )
    })
  })

  describe('imageName', () => {
    it('requires an image name', async () => {
      const build = createValidBuild()
      build.spec.imageName = ''

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Image name is required',
          }),
        ]),
      )
    })

    it.each([
      ['uppercase letters', 'Example'],
      ['underscores', 'example_image'],
      ['a leading hyphen', '-example'],
      ['a trailing hyphen', 'example-'],
      ['special characters', 'example$image'],
    ])('rejects an image name containing %s', async (_, imageName) => {
      const build = createValidBuild()
      build.spec.imageName = imageName

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Image name can only contain lowercase letters, numbers, and hyphens.',
          }),
        ]),
      )
    })

    it('requires at least two characters', async () => {
      const build = createValidBuild()
      build.spec.imageName = 'a'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Image name must be at least 2 characters',
          }),
        ]),
      )
    })

    it('rejects an image name longer than 128 characters', async () => {
      const build = createValidBuild()
      build.spec.imageName = 'a'.repeat(129)

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Image name must not exceed 128 characters',
          }),
        ]),
      )
    })

    it('rejects a combined image name and tag longer than 128 characters', async () => {
      const build = createValidBuild()

      build.spec.imageName = 'a'.repeat(120)
      build.spec.tag = '12345678'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Invalid container image name, the combined image name and tag must not exceed 128 characters.',
          }),
        ]),
      )
    })

    it('accepts a combined image name and tag of exactly 128 characters', async () => {
      const build = createValidBuild()

      build.spec.imageName = 'a'.repeat(119)
      build.spec.tag = '12345678'

      expect(`${build.spec.imageName}-${build.spec.tag}`).toHaveLength(128)

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('rejects an existing combined build name during submission', async () => {
      const build = createValidBuild()

      const errors = await getValidationErrors(build, {
        validateOnSubmit: true,
        buildNames: ['example-image-latest'],
      })

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.imageName',
            message: 'Container image name already exists, the combined image name and tag must be unique.',
          }),
        ]),
      )
    })

    it('skips uniqueness validation before submission', async () => {
      const build = createValidBuild()

      await expect(
        validate(build, {
          validateOnSubmit: false,
          buildNames: ['example-image-latest'],
        }),
      ).resolves.toBeDefined()
    })

    it('skips uniqueness validation when context is omitted', async () => {
      const build = createValidBuild()

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('accepts a unique combined build name during submission', async () => {
      const build = createValidBuild()

      await expect(
        validate(build, {
          validateOnSubmit: true,
          buildNames: ['another-image-latest'],
        }),
      ).resolves.toBeDefined()
    })

    it('accepts submission validation when buildNames is undefined', async () => {
      const build = createValidBuild()

      await expect(
        validate(build, {
          validateOnSubmit: true,
        }),
      ).resolves.toBeDefined()
    })
  })

  describe('tag', () => {
    it('requires a tag', async () => {
      const build = createValidBuild()
      build.spec.tag = ''

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.tag',
            message: 'Tag is required',
          }),
        ]),
      )
    })

    it.each([
      ['a leading hyphen', '-latest'],
      ['a leading dot', '.latest'],
      ['spaces', 'latest version'],
      ['a slash', 'release/latest'],
      ['more than 128 characters', `a${'b'.repeat(128)}`],
    ])('rejects a tag containing %s', async (_, tag) => {
      const build = createValidBuild()
      build.spec.tag = tag

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.tag',
            message: 'Tag must start with a letter, digit, or underscore, and can include dots, hyphens, underscores.',
          }),
        ]),
      )
    })

    it.each(['latest', 'v1.0.0', 'release-1', '_internal'])('accepts the valid tag "%s"', async (tag) => {
      const build = createValidBuild()
      build.spec.tag = tag

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('fails when the tag makes the combined build name exceed 128 characters', async () => {
      const build = createValidBuild()

      build.spec.imageName = 'a'.repeat(120)
      build.spec.tag = '12345678'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.tag',
          }),
        ]),
      )
    })

    it('fails tag uniqueness validation for an existing combined build name', async () => {
      const build = createValidBuild()

      const errors = await getValidationErrors(build, {
        validateOnSubmit: true,
        buildNames: ['example-image-latest'],
      })

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.tag',
          }),
        ]),
      )
    })
  })

  describe('mode', () => {
    it('requires a mode type when mode configuration is missing', async () => {
      const build = createValidBuild()
      delete build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.type',
            message: 'Mode type is required',
          }),
        ]),
      )
    })

    it('requires a mode type', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        docker: {
          repoUrl: 'https://github.com/example/repository',
        },
      } as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.type',
            message: 'Mode type is required',
          }),
        ]),
      )
    })

    it('rejects an invalid mode type', async () => {
      const build = createValidBuild()
      build.spec.mode.type = 'invalid'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.type',
            message: 'Invalid mode type',
          }),
        ]),
      )
    })

    it('requires a repository URL when Docker configuration is missing', async () => {
      const build = createValidBuild()
      delete build.spec.mode.docker

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.docker.repoUrl',
            message: 'Repository URL is required',
          }),
        ]),
      )
    })

    it('requires a repository URL when Buildpacks configuration is missing', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
      } as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.buildpacks.repoUrl',
            message: 'Repository URL is required',
          }),
        ]),
      )
    })

    it('does not require Docker configuration in Buildpacks mode', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          path: 'services/frontend',
        },
      } as unknown as typeof build.spec.mode

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('does not require Buildpacks configuration in Docker mode', async () => {
      const build = createValidBuild()

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('repository configuration', () => {
    it.each(['docker', 'buildpacks'] as const)('requires a repository URL in %s mode', async (modeType) => {
      const build = createValidBuild()

      build.spec.mode = {
        type: modeType,
        [modeType]: {
          repoUrl: '',
        },
      } as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: `spec.mode.${modeType}.repoUrl`,
            message: 'Repository URL is required',
          }),
        ]),
      )
    })

    it.each(['docker', 'buildpacks'] as const)('rejects an invalid repository URL in %s mode', async (modeType) => {
      const build = createValidBuild()

      build.spec.mode = {
        type: modeType,
        [modeType]: {
          repoUrl: 'not-a-url',
        },
      } as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: `spec.mode.${modeType}.repoUrl`,
            message: 'Invalid repository URL',
          }),
        ]),
      )
    })

    it.each(['docker', 'buildpacks'] as const)('accepts optional repository fields in %s mode', async (modeType) => {
      const build = createValidBuild()

      build.spec.mode = {
        type: modeType,
        [modeType]: {
          repoUrl: 'https://github.com/example/repository',
        },
      } as typeof build.spec.mode

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('rejects "./" at the start of a Buildpacks path', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          path: './services/frontend',
        },
      } as unknown as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.buildpacks.path',
            message: 'Path for Buildpacks cannot contain "./"',
          }),
        ]),
      )
    })

    it('rejects "./" anywhere in a Buildpacks path', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          path: 'services/./frontend',
        },
      } as unknown as typeof build.spec.mode

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.buildpacks.path',
            message: 'Path for Buildpacks cannot contain "./"',
          }),
        ]),
      )
    })

    it('allows a Buildpacks path without "./"', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          path: 'services/frontend',
        },
      } as unknown as typeof build.spec.mode

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows "./" in a Docker path', async () => {
      const build = createValidBuild()
      build.spec.mode.docker.path = './Dockerfile'

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('environment variables', () => {
    it('accepts valid Docker environment variable names', async () => {
      const build = createValidBuild()

      build.spec.mode.docker.envVars = [
        { name: 'NODE_ENV', value: 'production' },
        { name: '_PRIVATE', value: 'true' },
        { name: '--PREFIXED_NAME', value: 'value' },
        { name: 'VALUE-1', value: undefined },
      ]

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('accepts valid Buildpacks environment variable names', async () => {
      const build = createValidBuild()

      build.spec.mode = {
        type: 'buildpacks',
        buildpacks: {
          repoUrl: 'https://github.com/example/repository',
          envVars: [
            {
              name: 'NODE_ENV',
              value: 'production',
            },
          ],
        },
      } as unknown as typeof build.spec.mode

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('requires an environment variable name', async () => {
      const build = createValidBuild()

      build.spec.mode.docker.envVars = [
        {
          name: '',
          value: 'production',
        },
      ]

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.docker.envVars[0].name',
            message: 'Environment variable name is required',
          }),
        ]),
      )
    })

    it.each([
      ['starts with a number', '1VALUE'],
      ['contains a dot', 'NODE.ENV'],
      ['contains a space', 'NODE ENV'],
      ['contains a dollar sign', 'NODE$ENV'],
      ['contains only hyphens', '---'],
    ])('rejects an environment variable name that %s', async (_, name) => {
      const build = createValidBuild()

      build.spec.mode.docker.envVars = [
        {
          name,
          value: 'value',
        },
      ]

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.mode.docker.envVars[0].name',
            message: 'Invalid environment variable name',
          }),
        ]),
      )
    })

    it('allows an environment variable without a value', async () => {
      const build = createValidBuild()

      build.spec.mode.docker.envVars = [
        {
          name: 'OPTIONAL_VALUE',
          value: '',
        },
      ]

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows envVars to be omitted', async () => {
      const build = createValidBuild()
      delete build.spec.mode.docker.envVars

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows an empty envVars array', async () => {
      const build = createValidBuild()
      build.spec.mode.docker.envVars = []

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('metadata', () => {
    it('accepts valid metadata', async () => {
      const build = createValidBuild()

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows metadata name to be omitted', async () => {
      const build = createValidBuild()
      delete build.metadata.name

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('requires the team ID label', async () => {
      const build = createValidBuild()
      delete build.metadata.labels['apl.io/teamId']

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'metadata.labels["apl.io/teamId"]',
          }),
        ]),
      )
    })
  })

  describe('secretName', () => {
    it('rejects a one-character secret name', async () => {
      const build = createValidBuild()
      build.spec.secretName = 'a'

      const errors = await getValidationErrors(build)

      expect(errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: 'spec.secretName',
            message: 'Secret name must be at least 2 characters long.',
          }),
        ]),
      )
    })

    it('accepts a two-character secret name', async () => {
      const build = createValidBuild()
      build.spec.secretName = 'ab'

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('allows secretName to be omitted', async () => {
      const build = createValidBuild()
      delete build.spec.secretName

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('optional spec fields', () => {
    it('allows externalRepo, trigger and scanSource to be omitted', async () => {
      const build = createValidBuild()

      delete build.spec.externalRepo
      delete build.spec.trigger
      delete build.spec.scanSource

      await expect(validate(build)).resolves.toBeDefined()
    })

    it.each([
      ['externalRepo', true],
      ['externalRepo', false],
      ['trigger', true],
      ['trigger', false],
      ['scanSource', true],
      ['scanSource', false],
    ] as const)('accepts %s set to %s', async (field, value) => {
      const build = createValidBuild()
      build.spec[field] = value

      await expect(validate(build)).resolves.toBeDefined()
    })
  })

  describe('status', () => {
    it('allows status to be omitted', async () => {
      const build = createValidBuild()
      delete build.status

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('accepts a populated status', async () => {
      const build = createValidBuild()

      build.status = {
        phase: 'Ready',
        conditions: [
          {
            lastTransitionTime: '2026-08-05T08:00:00Z',
            message: 'Build completed',
            reason: 'BuildSucceeded',
            status: true,
            type: 'Ready',
          },
        ],
      }

      await expect(validate(build)).resolves.toBeDefined()
    })

    it('accepts empty condition objects because their properties are optional', async () => {
      const build = createValidBuild()

      build.status = {
        phase: 'Ready',
        conditions: [{}],
      }

      await expect(validate(build)).resolves.toBeDefined()
    })
  })
})
