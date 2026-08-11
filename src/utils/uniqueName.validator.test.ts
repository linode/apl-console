import * as yup from 'yup'

import { uniqueNameTest } from './uniqueName.validator'

describe('uniqueNameTest', () => {
  const schema = yup.string().test(uniqueNameTest('Name already exists.'))

  it('rejects a duplicate name', async () => {
    await expect(
      schema.validate('repo-name', {
        context: {
          validateOnSubmit: true,
          existingNames: ['repo-name'],
        },
      }),
    ).rejects.toThrow('Name already exists.')
  })

  it('rejects a duplicate with different casing', async () => {
    await expect(
      schema.validate('Repo-Name', {
        context: {
          validateOnSubmit: true,
          existingNames: ['repo-name'],
        },
      }),
    ).rejects.toThrow('Name already exists.')
  })

  it('rejects a duplicate with surrounding whitespace', async () => {
    await expect(
      schema.validate('  repo-name  ', {
        context: {
          validateOnSubmit: true,
          existingNames: ['repo-name'],
        },
      }),
    ).rejects.toThrow('Name already exists.')
  })

  it('accepts a unique name', async () => {
    await expect(
      schema.validate('repo-name', {
        context: {
          validateOnSubmit: true,
          existingNames: ['other-repo'],
        },
      }),
    ).resolves.toBe('repo-name')
  })

  it('skips validation when validateOnSubmit is false', async () => {
    await expect(
      schema.validate('repo-name', {
        context: {
          validateOnSubmit: false,
          existingNames: ['repo-name'],
        },
      }),
    ).resolves.toBe('repo-name')
  })
})
