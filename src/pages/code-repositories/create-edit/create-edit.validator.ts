import { boolean, object, string } from 'yup'

// Main validation schema for CreateCoderepoApiResponse
export const coderepoApiResponseSchema = object({
  id: string().optional(),
  teamId: string().optional(),
  label: string().required(),
  gitService: string().required(),
  repositoryUrl: string().required(),
  private: boolean().optional(),
  secret: string().when('private', {
    is: true,
    then: string().required('Secret is required when private is true'),
    otherwise: string().optional(),
  }),
})
