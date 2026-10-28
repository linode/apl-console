import { emptySplitApi as api } from './emptyApi'

export type ResetPasswordApiArg = {
  body: {
    oldPassword: string
    newPassword: string
  }
}

export type ResetPasswordApiResponse = {
  message?: string
}

// TODO: replace this mocked endpoint with the generated one from otomiApi once the API supports it
const MOCK_RESPONSE_DELAY_MS = 800

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    resetPassword: build.mutation<ResetPasswordApiResponse, ResetPasswordApiArg>({
      queryFn: async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, MOCK_RESPONSE_DELAY_MS)
        })
        return { data: { message: 'Password reset successfully' } }
      },
    }),
  }),
  overrideExisting: false,
})

export { injectedRtkApi as passwordApi }
export const { useResetPasswordMutation } = injectedRtkApi
