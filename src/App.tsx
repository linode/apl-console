import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { schemaPromise } from './hooks/api'
// import { useApi } from './hooks/api'
import Clusters from './pages/Clusters'
import Dashboard from './pages/Dashboard'
import Service from './pages/Service'
import Services from './pages/Services'
import Team from './pages/Team'
import Teams from './pages/Teams'
import { sessionContext } from './session-context'
import { createClasses, theme } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'

const testSession = {
  user: { email: 'testuser1@redkubes.com' },
  // team: { name: 'admin', clusters: [] },
  team: { name: 'driver', clusters: ['prd/aws'] },
  clusters: ['dev/azure', 'dev/google', 'dev/aws', 'prd/azure', 'prd/google', 'prd/aws'],
}

const App = (): any => {
  // const [session, initialising, error] = useApi('getSession')
  const [session, initialising] = [testSession, false]
  const [loaded, setLoaded] = useState(false)
  const classes = createClasses(styles)
  useEffect(() => {
    ;(async (): Promise<any> => {
      await schemaPromise
      setLoaded(true)
    })()
  })
  if (!loaded) {
    return <Loader />
  }
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
              isAdmin: session.team.name === 'admin',
              user: session.user,
              team: session.team,
              clusters: session.clusters,
            }}
          >
            <Router>
              <Switch>
                {/*!user && <Route path='/' component={Home} exact />*/}
                <Route path='/' component={Dashboard} exact />
                <Route path='/clusters' component={Clusters} exact />
                <Route path='/services' component={Services} exact />
                <Route path='/teams' component={Teams} exact />
                <Route path='/create-team' component={Team} exact />
                <Route path='/teams/:teamName' component={Team} exact />
                <Route path='/teams/:teamName/services' component={Services} exact />
                <Route path='/teams/:teamName/services/:serviceName' component={Service} exact />
                <Route path='/teams/:teamName/create-service' component={Service} exact />
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
