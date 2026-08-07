import { createAplTeamApiSchema } from './create-edit-teams.validator'

const baseTeam = {
  kind: 'AplTeamSettingSet',
  metadata: {
    name: 'team-one',
    labels: {},
  },
  spec: {},
  status: {},
}

describe('createAplTeamApiSchema', () => {
  describe('team name validation', () => {
    it('accepts a valid team name', async () => {
      await expect(createAplTeamApiSchema.validate(baseTeam)).resolves.toBeTruthy()
    })

    it('requires a team name', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          metadata: {
            ...baseTeam.metadata,
            name: '',
          },
        }),
      ).rejects.toThrow('Team name is required')
    })

    it('requires at least 3 characters', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          metadata: {
            ...baseTeam.metadata,
            name: 'ab',
          },
        }),
      ).rejects.toThrow('Team name must be at least 3 characters')
    })

    it('allows no more than 9 characters', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          metadata: {
            ...baseTeam.metadata,
            name: 'team-name1',
          },
        }),
      ).rejects.toThrow('Team name must not exceed 9 characters')
    })

    it('rejects capital letters', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          metadata: {
            ...baseTeam.metadata,
            name: 'Team-one',
          },
        }),
      ).rejects.toThrow('Team name cannot contain capital letters or underscores')
    })

    it('rejects underscores', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          metadata: {
            ...baseTeam.metadata,
            name: 'team_one',
          },
        }),
      ).rejects.toThrow('Team name cannot contain capital letters or underscores')
    })

    it('rejects an existing team name', async () => {
      await expect(
        createAplTeamApiSchema.validate(baseTeam, {
          context: {
            validateOnSubmit: true,
            existingNames: ['team-one'],
          },
        }),
      ).rejects.toThrow('Team name already exists.')
    })

    it('accepts a unique team name', async () => {
      await expect(
        createAplTeamApiSchema.validate(baseTeam, {
          context: {
            validateOnSubmit: true,
            existingNames: ['team-two'],
          },
        }),
      ).resolves.toBeTruthy()
    })

    it('skips duplicate validation when validateOnSubmit is false', async () => {
      await expect(
        createAplTeamApiSchema.validate(baseTeam, {
          context: {
            validateOnSubmit: false,
            existingNames: ['team-one'],
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('kind validation', () => {
    it('accepts AplTeamSettingSet', async () => {
      await expect(createAplTeamApiSchema.validate(baseTeam)).resolves.toBeTruthy()
    })

    it('rejects an invalid kind', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          kind: 'InvalidKind',
        }),
      ).rejects.toThrow()
    })
  })

  describe('defaults', () => {
    it('applies the managed monitoring defaults', () => {
      const team = createAplTeamApiSchema.cast({
        ...baseTeam,
        spec: {
          managedMonitoring: {},
        },
      })

      expect(team.spec?.managedMonitoring).toEqual({
        grafana: false,
        alertmanager: false,
      })
    })

    it('applies the default resource quotas', () => {
      const team = createAplTeamApiSchema.cast(baseTeam)

      expect(team.spec?.resourceQuota).toEqual([
        { name: 'services.loadbalancers', value: '0' },
        { name: 'services.nodeports', value: '0' },
        { name: 'requests.cpu', value: '24' },
        { name: 'requests.memory', value: '32' },
        { name: 'pods', value: '50' },
      ])
    })
  })

  describe('resource quota validation', () => {
    it('requires a resource quota name', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          spec: {
            resourceQuota: [
              {
                name: '',
                value: '10',
              },
            ],
          },
        }),
      ).rejects.toThrow('Resource quota name is required')
    })

    it('requires a resource quota value', async () => {
      await expect(
        createAplTeamApiSchema.validate({
          ...baseTeam,
          spec: {
            resourceQuota: [
              {
                name: 'pods',
                value: '',
              },
            ],
          },
        }),
      ).rejects.toThrow('Resource quota value is required')
    })
  })
})
