import { boolean, object, string } from 'yup'

// Main validation schema for CreateCoderepoApiResponse
export const createCoderepoApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  name: string().required('Code repository name is required'),
  type: string().optional(),
  isPrivate: boolean().optional(),
  url: string(),
  sealedSecret: string().optional(),
})
