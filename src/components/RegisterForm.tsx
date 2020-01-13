import { Box, Button, Divider, Typography as Text } from '@material-ui/core'
import { Field, FormikProps, withFormik } from 'formik'
import { TextField as FuiTextField } from 'formik-material-ui'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as Yup from 'yup'

interface FormValues {
  email: string
  password: string
}

const RegisterForm: React.FC<any> = ({ prefilledEmail, submitHandler, doRegisterWithGoogle }): any => {
  const Form = (
    formProps: FormikProps<{
      email: string
    }>,
  ): any => {
    const { handleSubmit, isValid, dirty, values } = formProps

    return (
      <React.Fragment>
        <Box mb={2}>
          <Text variant='h5'>Create an account</Text>
          <Text>
            Already have an account <Link to={{ pathname: '/login', state: { email: values.email } }}>Log in</Link>
          </Text>
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
          <Field
            name='password'
            label='Password'
            type='password'
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
              Create an account
            </Button>
          </Box>
        </form>

        <Box mt={1} textAlign='right'>
          <Text>
            <Link to={{ pathname: '/login', state: { email: values.email } }}>Back to login</Link>
          </Text>
        </Box>
        <Box my={3}>
          <Divider />
          <Box mt={3}>
            <Button onClick={doRegisterWithGoogle} fullWidth variant='outlined' color='secondary'>
              Sign up with Google
            </Button>
          </Box>
        </Box>
      </React.Fragment>
    )
  }
  const WithFormik = withFormik<any, FormValues>({
    handleSubmit: ({ email, password }): void => {
      submitHandler(email, password)
    },
    mapPropsToValues: (): FormValues => ({
      email: prefilledEmail || '',
      password: '',
    }),
    validateOnBlur: false,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Email not valid')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password should contain at least 6 characters')
        .required('Password is required'),
    }),
  })(Form)

  return <WithFormik />
}

export default RegisterForm
