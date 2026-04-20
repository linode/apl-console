import * as yup from 'yup'

export interface GitSettingsFormValues {
  repoUrl: string
  branch: string
  username: string
  password: string
  email: string
}

export const gitSettingsSchema = yup.object({
  repoUrl: yup
    .string()
    .required('Git repository URL is required')
    .matches(/^(https:\/\/|git@).+/, 'Enter a valid Git repository URL starting with https:// or git@'),
  branch: yup.string().required('Branch is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  email: yup.string().email('Enter a valid email address').required('Email address is required'),
})
