import { Box, Button, Typography as Text } from '@material-ui/core'
import { Field, FormikProps, withFormik } from 'formik'
import { TextField as FuiTextField } from 'formik-material-ui'
import React from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

interface FormValues {
  email: string
}

const ResetPasswordForm: React.FC<any> = ({ prefilledEmail, submitHandler }): any => {
  const Form = (
    formProps: FormikProps<{
      email: string
    }>,
  ): any => {
    const { handleSubmit, isValid, dirty, values } = formProps

    return (
      <React.Fragment>
        <Box mb={2}>
          <Text variant='h5'>Reset password</Text>
          <Text>We'll send you a password reset link</Text>
        </Box>
        <form onSubmit={handleSubmit}>
          <Field
            name='email'
            label='Email'
            type='email'
            component={FuiTextField}
            fullWidth
            required
            variant='filled'
            margin='dense'
            InputProps={{
              disableUnderline: true,
            }}
          />
          <Box mt={1}>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='secondary'
              disabled={!isValid || (!dirty && isValid)}
            >
              Send password reset mail
            </Button>
          </Box>
        </form>
        <Box mt={1} textAlign='right'>
          <Text>
            <Link to={{ pathname: '/login', state: { email: values.email } }}>Back to login</Link>
          </Text>
        </Box>
      </React.Fragment>
    )
  }
  const WithFormik = withFormik<any, FormValues>({
    handleSubmit({ email }): void {
      submitHandler(email)
    },
    mapPropsToValues: (): FormValues => ({
      email: prefilledEmail || '',
    }),
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email not valid')
        .required('Email is required'),
    }),
  })(Form)

  return <WithFormik />
}

export default ResetPasswordForm
