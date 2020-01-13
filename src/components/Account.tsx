import { Box, Button, Container, Typography as Text } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import * as firebase from 'firebase/app'
import { Field, FormikProps, withFormik } from 'formik'
import { TextField as FuiTextField } from 'formik-material-ui'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore'
import { Link, RouteComponentProps } from 'react-router-dom'
import * as Yup from 'yup'
import { useSession } from '../auth'
import PrivateContainer from './PrivateContainer'

interface FormValues {
  firstName?: string
  lastName?: string
  organisation?: string
  role?: string
}

const Account: React.FC<RouteComponentProps> = ({ location, history }): any => {
  const user = useSession()
  const [accountInfo, loading, error] = useDocumentDataOnce(firebase.firestore().doc(`accounts/${user.uid}`))
  const addOrUpdateUser = async (userData: FormValues): Promise<any> =>
    firebase
      .firestore()
      .collection('accounts')
      .doc(user.uid)
      .set(userData)

  const { enqueueSnackbar } = useSnackbar()
  const isRegistration = location.state && location.state.isRegistration

  const AccountForm = (
    formProps: FormikProps<{
      firstName?: string
      lastName?: string
      organisation?: string
      role?: string
    }>,
  ): any => {
    const { handleSubmit, isValid, isSubmitting, dirty } = formProps
    return (
      <React.Fragment>
        <React.Fragment>
          <form onSubmit={handleSubmit}>
            <Field
              name='firstName'
              label='First name'
              component={FuiTextField}
              fullWidth
              variant='filled'
              margin='dense'
              InputProps={{
                disableUnderline: true,
              }}
              disabled={loading}
            />
            <Field
              name='lastName'
              label='Last name'
              component={FuiTextField}
              fullWidth
              variant='filled'
              margin='dense'
              InputProps={{
                disableUnderline: true,
              }}
              disabled={loading}
            />
            <Field
              name='organisation'
              label='Organisation'
              component={FuiTextField}
              fullWidth
              variant='filled'
              margin='dense'
              InputProps={{
                disableUnderline: true,
              }}
              disabled={loading}
            />
            <Field
              name='role'
              label='Role'
              component={FuiTextField}
              fullWidth
              variant='filled'
              margin='dense'
              InputProps={{
                disableUnderline: true,
              }}
              disabled={loading}
            />
            <Box mt={1}>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='secondary'
                disabled={!isValid || loading || !dirty || isSubmitting}
                startIcon={<SaveIcon />}
              >
                {isRegistration ? 'Save and continue' : 'Save'}
              </Button>
            </Box>
          </form>
        </React.Fragment>
        <Box mt={1} textAlign='right'>
          <Text>
            {isRegistration ? (
              <Link to={{ pathname: '/' }}>Skip</Link>
            ) : (
              <Link to={{ pathname: '/' }}>Back to dashboard</Link>
            )}
          </Text>
        </Box>
      </React.Fragment>
    )
  }

  const WithFormik = withFormik<any, FormValues>({
    mapPropsToValues: (): any => ({
      firstName: accountInfo && accountInfo.firstName ? accountInfo.firstName : '',
      lastName: accountInfo && accountInfo.lastName ? accountInfo.lastName : '',
      organisation: accountInfo && accountInfo.organisation ? accountInfo.organisation : '',
      role: accountInfo && accountInfo.role ? accountInfo.role : '',
    }),
    validationSchema: Yup.object().shape({
      firstName: Yup.string()
        .max(50)
        .matches(/^[a-z ,.'-]+$/i),
      lastName: Yup.string()
        .max(50)
        .matches(/^[a-z ,.'-]+$/i),
      organisation: Yup.string().max(50),
      role: Yup.string().max(50),
    }),
    handleSubmit: (values, { setSubmitting }): any => {
      setSubmitting(true)
      addOrUpdateUser(values)
        .then((): any => {
          enqueueSnackbar('Done!', {
            variant: 'success',
            autoHideDuration: 1500,
          })
          if (isRegistration) {
            history.push('/')
          }
        })
        .finally(() => setSubmitting(false))
        .catch(({ code, message }) => {
          enqueueSnackbar(message, {
            variant: 'error',
            autoHideDuration: 1500,
          })
        })
    },
    validateOnMount: true,
  })(AccountForm)

  return (
    <PrivateContainer>
      <Container maxWidth='xs'>
        <Box textAlign='center'>
          <Box mt={12} textAlign='center'>
            <Box mb={2}>
              <Text variant='h5'>Account details</Text>
            </Box>
            <WithFormik />
          </Box>
        </Box>
      </Container>
    </PrivateContainer>
  )
}

export default Account
