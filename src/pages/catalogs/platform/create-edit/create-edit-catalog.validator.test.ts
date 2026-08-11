import { aplCatalogApiSchema } from './create-edit-catalog.validator'

const baseCatalog = {
  kind: 'AplCatalog',
  metadata: {
    name: 'team-catalog',
  },
  spec: {
    name: 'team-catalog',
    branch: 'main',
    repositoryUrl: 'https://github.com/linode/apl-charts.git',
    chartsPath: 'charts',
    enabled: true,
  },
  status: {
    conditions: [],
  },
}

describe('aplCatalogApiSchema', () => {
  describe('metadata name validation', () => {
    it('accepts a valid catalog name', async () => {
      await expect(aplCatalogApiSchema.validate(baseCatalog)).resolves.toBeTruthy()
    })

    it('requires a catalog name', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: '',
          },
        }),
      ).rejects.toThrow('Catalog name is a required field.')
    })

    it('requires at least 2 characters', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: 'a',
          },
        }),
      ).rejects.toThrow('Catalog name must be at least 2 characters long.')
    })

    it('rejects a name that starts with a number', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: '1catalog',
          },
        }),
      ).rejects.toThrow(
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      )
    })

    it('rejects capital letters', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: 'Team-catalog',
          },
        }),
      ).rejects.toThrow(
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      )
    })

    it('rejects underscores', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: 'team_catalog',
          },
        }),
      ).rejects.toThrow(
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      )
    })

    it('rejects a trailing hyphen', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          metadata: {
            ...baseCatalog.metadata,
            name: 'team-catalog-',
          },
        }),
      ).rejects.toThrow(
        'Invalid format, must start with a lowercase letter, contain only lowercase letters, numbers, or hyphens, and end with a letter or number.',
      )
    })

    it('rejects an existing catalog name', async () => {
      await expect(
        aplCatalogApiSchema.validate(baseCatalog, {
          context: {
            validateOnSubmit: true,
            existingNames: ['team-catalog'],
          },
        }),
      ).rejects.toThrow('Catalog name already exists.')
    })

    it('accepts a unique catalog name', async () => {
      await expect(
        aplCatalogApiSchema.validate(baseCatalog, {
          context: {
            validateOnSubmit: true,
            existingNames: ['other-catalog'],
          },
        }),
      ).resolves.toBeTruthy()
    })

    it('skips duplicate validation when validateOnSubmit is false', async () => {
      await expect(
        aplCatalogApiSchema.validate(baseCatalog, {
          context: {
            validateOnSubmit: false,
            existingNames: ['team-catalog'],
          },
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('spec validation', () => {
    it('requires spec name', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          spec: {
            ...baseCatalog.spec,
            name: '',
          },
        }),
      ).rejects.toThrow('Catalog name is a required field.')
    })

    it('requires branch', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          spec: {
            ...baseCatalog.spec,
            branch: '',
          },
        }),
      ).rejects.toThrow('Branch is a required field.')
    })

    it('requires repository URL', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          spec: {
            ...baseCatalog.spec,
            repositoryUrl: '',
          },
        }),
      ).rejects.toThrow('Repository URL is a required field.')
    })

    it('accepts an omitted charts path', async () => {
      const { chartsPath: _chartsPath, ...specWithoutChartsPath } = baseCatalog.spec

      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          spec: specWithoutChartsPath,
        }),
      ).resolves.toBeTruthy()
    })
  })

  describe('kind validation', () => {
    it('accepts AplCatalog', async () => {
      await expect(aplCatalogApiSchema.validate(baseCatalog)).resolves.toBeTruthy()
    })

    it('rejects an invalid kind', async () => {
      await expect(
        aplCatalogApiSchema.validate({
          ...baseCatalog,
          kind: 'InvalidKind',
        }),
      ).rejects.toThrow()
    })

    it('defaults kind to AplCatalog', () => {
      const result = aplCatalogApiSchema.cast({
        ...baseCatalog,
        kind: undefined,
      })

      expect(result.kind).toBe('AplCatalog')
    })
  })

  describe('defaults', () => {
    it('defaults enabled to true', () => {
      const result = aplCatalogApiSchema.cast({
        ...baseCatalog,
        spec: {
          ...baseCatalog.spec,
          enabled: undefined,
        },
      })

      expect(result.spec?.enabled).toBe(true)
    })
  })
})
