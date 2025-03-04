import { object, string } from 'yup'

// Main validation
export const buildApiResponseSchema = object({
  name: string().optional(),
})
