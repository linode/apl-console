import { customValuePolicies, policySchema, supportsCustomValues } from './create-edit-policies.validator'

const validate = (values: unknown) => policySchema.validate(values, { strict: true })

test.each(['Audit', 'Enforce'])('accepts action %s', async (action) => {
  const values = { action, severity: 'medium' }
  await expect(validate(values)).resolves.toEqual(values)
})

test.each(['low', 'medium', 'high'])('accepts severity %s', async (severity) => {
  const values = { action: 'Audit', severity, customValues: ['', 'retained', 'retained'] }
  await expect(validate(values)).resolves.toEqual(values)
})

test.each([
  [{ severity: 'medium' }, 'Action is required'],
  [{ action: '', severity: 'medium' }, 'Select a valid policy action'],
  [{ action: 'Ignore', severity: 'medium' }, 'Select a valid policy action'],
  [{ action: 'Audit' }, 'Severity is required'],
  [{ action: 'Audit', severity: 'critical' }, 'Select a valid severity'],
  [{ action: 'Audit', severity: 1 }, 'Select a valid severity'],
  [{ action: 'Audit', severity: 'medium', customValues: null }, 'customValues'],
  [{ action: 'Audit', severity: 'medium', customValues: 'invalid' }, 'customValues'],
  [{ action: 'Audit', severity: 'medium', customValues: [undefined] }, 'customValues[0]'],
  [{ action: 'Audit', severity: 'medium', customValues: [123] }, 'customValues[0]'],
])('rejects invalid policy fields', async (values: unknown, message: string) => {
  await expect(validate(values)).rejects.toThrow(message)
})

test.each([{ customValues: undefined }, { customValues: [] }])(
  'allows optional or empty custom values',
  async ({ customValues }) => {
    const values = { action: 'Enforce', severity: 'high', customValues }
    await expect(validate(values)).resolves.toEqual(values)
  },
)

test('preserves server-provided fields instead of stripping unknown values', async () => {
  const values = { action: 'Audit', severity: 'medium', futureField: { keep: true } }
  await expect(validate(values)).resolves.toEqual(values)
})

test.each(customValuePolicies)('%s has an explicit static custom-values section', (name) => {
  expect(supportsCustomValues(name)).toBe(true)
})

test.each(['disallow-host-path', 'require-limits', 'unknown'])(
  '%s does not generate custom-values controls',
  (name) => {
    expect(supportsCustomValues(name)).toBe(false)
  },
)
