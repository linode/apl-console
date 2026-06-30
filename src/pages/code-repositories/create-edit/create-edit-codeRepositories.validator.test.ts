import { aplCodeRepoApiSchema } from './create-edit-codeRepositories.validator'

const baseRepo = {
  kind: 'AplTeamCodeRepo',
  spec: {
    gitService: 'github',
    repositoryUrl: 'https://github.com/linode/apl-examples',
    private: false,
  },
  metadata: {
    name: 'repo-name',
    labels: {
      'apl.io/teamId': 'team1',
    },
  },
  status: {},
}

describe('aplCodeRepoApiSchema', () => {
  describe('repositoryUrl validation', () => {
    it.each(['https://github.com/linode/apl-examples', 'git@github.com:linode/apl-examples.git'])(
      'accepts valid github url: %s',
      async (repositoryUrl) => {
        await expect(
          aplCodeRepoApiSchema.validate({
            ...baseRepo,
            spec: {
              ...baseRepo.spec,
              gitService: 'github',
              repositoryUrl,
            },
          }),
        ).resolves.toBeTruthy()
      },
    )

    it('rejects duplicate url when only .git differs', async () => {
      await expect(
        aplCodeRepoApiSchema.validate(
          {
            ...baseRepo,
            spec: {
              ...baseRepo.spec,
              repositoryUrl: 'https://github.com/linode/apl-examples.git',
            },
          },
          {
            context: {
              validateOnSubmit: true,
              codeRepoUrls: ['https://github.com/linode/apl-examples'],
            },
          },
        ),
      ).rejects.toThrow('Repository URL must be unique.')
    })

    it('rejects duplicate url when only trailing slash differs', async () => {
      await expect(
        aplCodeRepoApiSchema.validate(
          {
            ...baseRepo,
            spec: {
              ...baseRepo.spec,
              repositoryUrl: 'https://github.com/linode/apl-examples/',
            },
          },
          {
            context: {
              validateOnSubmit: true,
              codeRepoUrls: ['https://github.com/linode/apl-examples'],
            },
          },
        ),
      ).rejects.toThrow('Repository URL must be unique.')
    })

    it('accepts unique repository url', async () => {
      await expect(
        aplCodeRepoApiSchema.validate(baseRepo, {
          context: {
            validateOnSubmit: true,
            codeRepoUrls: ['https://github.com/linode/other-repo'],
          },
        }),
      ).resolves.toBeTruthy()
    })

    it('skips uniqueness validation when validateOnSubmit is false', async () => {
      await expect(
        aplCodeRepoApiSchema.validate(baseRepo, {
          context: {
            validateOnSubmit: false,
            codeRepoUrls: ['https://github.com/linode/apl-examples'],
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('private repository secret', () => {
    it('requires secret when private=true', async () => {
      await expect(
        aplCodeRepoApiSchema.validate({
          ...baseRepo,
          spec: {
            ...baseRepo.spec,
            private: true,
          },
        }),
      ).rejects.toThrow('Secret is required when private is true.')
    })

    it('accepts secret when private=true', async () => {
      await expect(
        aplCodeRepoApiSchema.validate({
          ...baseRepo,
          spec: {
            ...baseRepo.spec,
            private: true,
            secret: 'my-secret',
          },
        }),
      ).resolves.toBeTruthy()
    })
  })
})
