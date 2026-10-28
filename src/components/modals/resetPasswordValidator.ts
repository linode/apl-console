import * as yup from 'yup'

export const MIN_PASSWORD_LENGTH = 8

export interface ResetPasswordFormValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export const resetPasswordSchema = yup.object({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .notOneOf([yup.ref('oldPassword')], 'New password must be different from the old password'),
  confirmPassword: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('newPassword')], 'Passwords do not match'),
})
