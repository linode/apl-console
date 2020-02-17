import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import * as firebase from 'firebase/app'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { useSession } from '../auth'
import { theme } from '../theme'
import { userContext } from '../user-context'
import Account from './Account'
import Dashboard from './Dashboard'
import Home from './Home'
import LoginContainer from './LoginContainer'
import OnboardingWizard from './OnboardingWizard'
import PrivateContainer from './PrivateContainer'

const PrivateRoute = ({ ...props }): any => {
  const user = useSession()
  if (!user) {
    return <Redirect to='/login' />
  }
  return (
    <PrivateContainer>
      <Route {...props}></Route>
    </PrivateContainer>
  )
}

const App: React.FC = (): any => {
  const [user, initialising] = useAuthState(firebase.auth())

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
        {initialising ? (
          <Backdrop open={initialising} style={{ zIndex: 1500 }}>
            <CircularProgress />
          </Backdrop>
        ) : (
          <userContext.Provider
            value={{
              initialising,
              user,
            }}
          >
            <Router>
              <Switch>
                {/*!user && <Route path='/' component={Home} exact />*/}
                <PrivateRoute path='/teams' component={Teams} exact />
                <PrivateRoute path='/teams/{id}' component={Team} exact />
                <PrivateRoute path='/create-app' component={OnboardingWizard} />
                <PrivateRoute path='*'>404 page here</PrivateRoute>
              </Switch>
            </Router>
          </userContext.Provider>
        )}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
