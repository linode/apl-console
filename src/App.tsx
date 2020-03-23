import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch, useRouteMatch } from 'react-router-dom'
import Loader from './components/Loader'
import { schemaPromise } from './hooks/api'
// import { useApi } from './hooks/api'
import Clusters from './pages/Clusters'
import Dashboard from './pages/Dashboard'
import OtomiApps from './pages/OtomiApps'
import Service from './pages/Service'
import Services from './pages/Services'
import Team from './pages/Team'
import Teams from './pages/Teams'
import { sessionContext } from './session-context'
import { adminTheme, createClasses, theme } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'

let sessionIdx = 0
const testSessions = [
  {
    user: { email: 'bob.admin@redkubes.com' },
    team: { name: 'admin', clusters: [] },
    clusters: ['dev/azure', 'dev/google', 'dev/aws', 'prd/azure', 'prd/google', 'prd/aws'],
  },
  {
    user: { email: 'dan.team@redkubes.com' },
    team: { name: 'taxi', clusters: ['prd/aws'] },
    clusters: ['dev/azure', 'dev/google', 'dev/aws', 'prd/azure', 'prd/google', 'prd/aws'],
  },
]

const App = (): any => {
  // const [session, initialising, error] = useApi('getSession')
  const initialising = false
  const [loaded, setLoaded] = useState(false)
  const [session, setSession] = useState(testSessions[sessionIdx])
  const [selectedTheme, setSelectedTheme] = useState(adminTheme)
  const classes = createClasses(styles)
  useEffect(() => {
    ;(async (): Promise<any> => {
      // tslint:disable-next-line
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
              <Route
                path='/change-role'
                render={({ location: { state } }): any => {
                  sessionIdx = sessionIdx === 0 ? 1 : 0
                  setSession(testSessions[sessionIdx])
                  setSelectedTheme(sessionIdx === 0 ? adminTheme : theme)
                  return <Redirect to='/' />
                }}
                exact
              />
              <Route path='/' component={Dashboard} exact />
              <Route path='/otomi/apps' component={OtomiApps} exact />
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
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
