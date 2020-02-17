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
import { DefaultApiFp as api } from '../api/api'
import { useSession } from '../auth'
import PrivateContainer from './PrivateContainer'

interface FormValues {
  firstName?: string
  lastName?: string
  organisation?: string
  role?: string
}

const Team: React.FC<RouteComponentProps> = ({ location, history }): any => {
  const team = useSession()
  const [teamInfo, loading, error] = useDocumentDataOnce(firebase.firestore().doc(`teams/${team.uid}`))
  const addOrUpdateTeam = async (teamData: FormValues): Promise<any> =>
    firebase
      .firestore()
      .collection('teams')
      .doc(team.uid)
      .set(teamData)

  const { enqueueSnackbar } = useSnackbar()
  const isRegistration = location.state && location.state.isRegistration

  const TeamForm = (
    formProps: FormikProps<{
      name?: string
    }>,
  ): any => {
    const { handleSubmit, isValid, isSubmitting, dirty } = formProps
    return (
      <React.Fragment>
        <React.Fragment>
          <form onSubmit={handleSubmit}>
            <Field
              name='name'
              label='Name'
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
      firstName: teamInfo && teamInfo.firstName ? teamInfo.firstName : '',
      lastName: teamInfo && teamInfo.lastName ? teamInfo.lastName : '',
      organisation: teamInfo && teamInfo.organisation ? teamInfo.organisation : '',
      role: teamInfo && teamInfo.role ? teamInfo.role : '',
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
      addOrUpdateTeam(values)
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
  })(TeamForm)

  return (
    <PrivateContainer>
      <Container maxWidth='xs'>
        <Box textAlign='center'>
          <Box mt={12} textAlign='center'>
            <Box mb={2}>
              <Text variant='h5'>Team details</Text>
            </Box>
            <WithFormik />
          </Box>
        </Box>
      </Container>
    </PrivateContainer>
  )
}

export default Team
