import { Box, Container } from '@material-ui/core'
import { withSnackbar } from 'notistack'
import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router-dom'
import { createUserWithEmail, loginWithEmail, loginWithGoogle, sendPasswordResetEmail } from '../auth'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import ResetPasswordForm from './ResetPasswordForm'

const LoginContainer: React.FC<RouteComponentProps & any> = (props: any): any => {
  const doLoginWithEmail = (email: string, password: string): void => {
    loginWithEmail(email, password)
      .then(() => {
        props.history.push('/')
      })
      .catch(({ code, message }) => {
        props.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 })
      })
  }
  const doLoginWithGoogle = (): void => {
    loginWithGoogle()
      .then(() => {
        props.history.push('/')
      })
      .catch(({ code, message }) => {
        props.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 })
      })
  }
  const doRegisterWithEmail = (email: string, password: string): void => {
    createUserWithEmail(email, password)
      .then(() => {
        props.history.push('/account')
      })
      .catch(({ code, message }) => {
        props.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 })
      })
  }
  const doRegisterWithGoogle = (): void => {
    loginWithGoogle()
      .then(() => {
        props.history.push('/account')
      })
      .catch(({ code, message }) => {
        props.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 })
      })
  }
  const doSendPasswordResetEmail = (email: string): void => {
    sendPasswordResetEmail(email)
      .then(() => {
        props.enqueueSnackbar("We've sent you an email!", { variant: 'success', autoHideDuration: 2000 })
      })
      .catch(({ code, message }) => {
        props.enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 })
      })
  }
  return (
    <Container maxWidth='xs'>
      <Box textAlign='center'>
        <Box mt={12} textAlign='center'>
          <Switch>
            <Route
              path='/login'
              render={({ location }): any => (
                <LoginForm
                  prefilledEmail={location.state && location.state.email}
                  submitHandler={doLoginWithEmail}
                  doLoginWithGoogle={doLoginWithGoogle}
                />
              )}
            />
            <Route
              path='/register'
              render={({ location }): any => (
                <RegisterForm
                  prefilledEmail={location.state && location.state.email}
                  submitHandler={doRegisterWithEmail}
                  doRegisterWithGoogle={doRegisterWithGoogle}
                />
              )}
            />
            <Route
              path='/recover-password'
              render={({ location }): any => (
                <ResetPasswordForm
                  prefilledEmail={location.state && location.state.email}
                  submitHandler={doSendPasswordResetEmail}
                />
              )}
            ></Route>
          </Switch>
        </Box>
      </Box>
    </Container>
  )
}

export default withSnackbar(LoginContainer)
