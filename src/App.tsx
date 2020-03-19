import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import * as React from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
// import { useApi } from './hooks/api'
import Service from './pages/Service'
import Services from './pages/Services'
import Team from './pages/Team'
import Teams from './pages/Teams'
import { sessionContext } from './session-context'
import { createClasses, theme } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'

const testSession = {
  user: { email: 'testuser1@redkubes.com' },
  team: { name: 'driver', clusters: ['prd/aws'] },
  clusters: ['dev/azure', 'dev/google', 'dev/aws', 'prd/azure', 'prd/google', 'prd/aws'],
}

const App = (): any => {
  // const [session, initialising, error] = useApi('getSession')
  const [session, initialising] = [testSession, false]

  const classes = createClasses(styles)
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        {...defaultOpts}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        classes={{
          variantSuccess: classes.success,
          variantError: classes.error,
          variantWarning: classes.warning,
          variantInfo: classes.info,
        }}
      >
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
              clusters: session.clusters,
            }}
          >
            <Router>
              <Switch>
                {/*!user && <Route path='/' component={Home} exact />*/}
                <Route path='/services' component={Services} exact />
                <Route path='/services-create' component={Service} exact />
                <Route path='/services/:serviceName' component={Service} exact />
                <Route path='/teams' component={Teams} exact />
                <Route path='/teams-create' component={Team} exact />
                <Route path='/teams/:teamName' component={Team} exact />
                <Route path='/teams/:teamName/services/:serviceName' component={Service} exact />
                <Redirect exact from='/' to='/teams' />
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
