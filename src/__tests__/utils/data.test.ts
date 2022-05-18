import { cleanDeep } from 'utils/data'

it('Does not clean undefined from arrays', () => {
  const d = cleanDeep({ a: [1, undefined], b: { c: [2, undefined] } }, { undefinedArrayValues: false })
  expect(d).toEqual({ a: [1, undefined], b: { c: [2, undefined] } })
})

it('Does clean undefined from arrays', () => {
  const d = cleanDeep({ a: [1, undefined], b: { c: [2, undefined] } }, { undefinedArrayValues: true })
  expect(d).toEqual({ a: [1], b: { c: [2] } })
})
