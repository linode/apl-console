import { Box, Button, Divider, Typography as Text } from '@material-ui/core'
import { Field, FormikProps, withFormik } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

interface FormValues {
  email: string
  password: string
}
const LoginForm: React.FC<any> = ({ prefilledEmail, submitHandler, doLoginWithGoogle }): any => {
  const Form = (formProps: FormikProps<{ email: string }>): any => {
    const { handleSubmit, isValid, dirty, values } = formProps
    return (
      <React.Fragment>
        <Box mb={2}>
          <Text variant='h5'>Log in</Text>
          <Text>
            Don't have an account yet?{' '}
            <Link to={{ pathname: '/register', state: { email: values.email } }}>Register</Link>
          </Text>
        </Box>
        <React.Fragment>
          <form onSubmit={handleSubmit}>
            <Field
              name='email'
              label='Email'
              type='email'
              component={TextField}
              fullWidth
              required
              variant='filled'
              margin='dense'
              InputProps={{
                disableUnderline: true,
              }}
            />
            <Field
              name='password'
              label='Password'
              type='password'
              component={TextField}
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
                Log in
              </Button>
            </Box>
          </form>
        </React.Fragment>
        <Box mt={1} textAlign='right'>
          <Text>
            <Link to={{ pathname: '/recover-password', state: { email: values.email } }}>Forgot password?</Link>
          </Text>
        </Box>
        <Box my={3}>
          <Divider />
          <Box mt={3}>
            <Button onClick={doLoginWithGoogle} fullWidth variant='outlined' color='secondary'>
              Log in with Google
            </Button>
          </Box>
        </Box>
      </React.Fragment>
    )
  }
  const WithFormik = withFormik<any, FormValues>({
    mapPropsToValues: (): FormValues => ({
      email: prefilledEmail || '',
      password: '',
    }),
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email not valid')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    handleSubmit({ email, password }): void {
      submitHandler(email, password)
    },
  })(Form)

  return <WithFormik />
}

export default LoginForm
