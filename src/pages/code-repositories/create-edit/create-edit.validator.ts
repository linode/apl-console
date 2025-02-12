import { boolean, object, string } from 'yup'

// Main validation schema for CreateCoderepoApiResponse
export const coderepoApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  label: string().required(),
  gitService: string().required(),
  repositoryUrl: string().required(),
  private: boolean().optional(),
  secret: string().optional(),
})
