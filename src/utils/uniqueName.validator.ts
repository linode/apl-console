// validators/uniqueName.validator.ts
import * as yup from 'yup'

interface UniqueNameContext {
  validateOnSubmit?: boolean
  existingNames?: string[]
  currentName?: string
}

const normalizeName = (value: string): string => value.trim().toLowerCase()

export const uniqueNameTest = (
  message = 'Name already exists.',
): yup.TestConfig<string | undefined, UniqueNameContext> => ({
  name: 'unique-name',
  message,
  test(value) {
    const { validateOnSubmit = true, existingNames = [], currentName } = this.options.context ?? {}

    if (!validateOnSubmit || !value) return true

    const normalizedValue = normalizeName(value)
    const normalizedCurrentName = currentName ? normalizeName(currentName) : undefined

    return !existingNames.some((existingName) => {
      const normalizedExistingName = normalizeName(existingName)

      if (normalizedCurrentName && normalizedExistingName === normalizedCurrentName) return false

      return normalizedExistingName === normalizedValue
    })
  },
})
