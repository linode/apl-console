import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'material-ui-snackbar-provider'
import * as React from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { sessionContext } from '../session-context'
import { theme } from '../theme'
// import { useApi } from './hooks/api'
import Service from './Services/Service'
import Services from './Services/Services'

const testSession = { user: { email: 'testuser1@redkubes.com' }, team: { name: 'taxi', clusters: { id: 'dev/azure' } } }

const App = (): any => {
  // const [session, initialising, error] = useApi('getSession')
  const [session, initialising] = [testSession, false]

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <CssBaseline />
        <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
        {initialising ? (
          <Backdrop open={initialising} style={{ zIndex: 1500 }}>
            <CircularProgress />
          </Backdrop>
        ) : (
          <sessionContext.Provider
            value={{
              initialising,
              user: session.user,
              team: session.team,
            }}
          >
            <Router>
              <Switch>
                {/*!user && <Route path='/' component={Home} exact />*/}
                <Route path='/services' component={Services} exact />
                <Route path='/services/{id}' component={Service} exact />
                <Route path='/services/{id}' component={Service} exact />
                <Redirect exact from='/' to='/services' />
                <Route path='*'>404 page here</Route>
              </Switch>
            </Router>
          </sessionContext.Provider>
        )}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
