import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { schemaPromise, useApi } from './hooks/api'
import { useLocalStorage } from './hooks/useLocalStorage'
import Cluster from './pages/Cluster'
import Clusters from './pages/Clusters'
import Dashboard from './pages/Dashboard'
import Error from './pages/Error'
import OtomiApps from './pages/OtomiApps'
import Secret from './pages/Secret'
import Secrets from './pages/Secrets'
import Service from './pages/Service'
import Services from './pages/Services'
import Settings from './pages/Settings'
import Team from './pages/Team'
import Teams from './pages/Teams'
import { SessionContext } from './session-context'
import { createClasses, getTheme, setThemeName, setThemeType } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'

const env = process.env

interface Props {
  user: any
}
const LoadedApp = ({ user }: Props): any => {
  const classes = createClasses(styles)
  const [session, sessionLoading]: any = useApi('getSession')
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  setThemeType(themeType)
  if (sessionLoading) {
    return <Loader />
  }
  if (session.user) setThemeName(session.user.isAdmin ? 'admin' : 'team')
  return (
    <ThemeProvider theme={getTheme()}>
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
        <>
          <CssBaseline />
          <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
          <SessionContext.Provider
            value={{
              ...session,
              user: { ...session.user, email: user.email },
              oboTeamId,
              setOboTeamId,
              themeType,
              setThemeType: setType,
            }}
          >
            <Router basename={env.PUBLIC_URL || ''}>
              <Switch>
                {/*! user && <Route path='/' component={Home} exact /> */}
                <Route path='/' component={Dashboard} exact />
                <Route path='/apps/:teamId' component={OtomiApps} exact />
                <Route path='/clusters' component={Clusters} exact />
                <Route path='/cluster/:clusterId' component={Cluster} exact />
                <Route path='/services' component={Services} exact />
                <Route path='/teams' component={Teams} exact />
                <Route path='/create-secret' component={Secret} exact />
                <Route path='/create-service' component={Service} exact />
                <Route path='/create-team' component={Team} exact />
                <Route path='/settings' component={Settings} exact />
                <Route path='/teams/:teamId' component={Team} exact />
                <Route path='/teams/:teamId/create-secret' component={Secret} exact />
                <Route path='/teams/:teamId/create-service' component={Service} exact />
                <Route path='/teams/:teamId/secrets' component={Secrets} exact />
                <Route path='/teams/:teamId/secrets/:secretId' component={Secret} exact />
                <Route path='/teams/:teamId/services' component={Services} exact />
                <Route path='/teams/:teamId/services/:serviceId' component={Service} exact />
                <Route path='*'>
                  <Error code={404} />
                </Route>
              </Switch>
            </Router>
          </SessionContext.Provider>
        </>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

const App = (): any => {
  const [loaded, setLoaded] = useState(false)
  const [user, setUser]: any = useState()
  useEffect(() => {
    let userPromise
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-restricted-globals
      const teamId = location.search.includes('team') ? new URLSearchParams(location.search).get('team') : 'admin'
      const role = teamId === 'admin' ? 'admin' : 'team'
      const isAdmin = teamId === 'admin'
      const name = teamId === 'admin' ? 'bob.admin' : `joe.team`
      userPromise = Promise.resolve({ email: `${name}@otomi.cloud`, role, isAdmin })
    } else {
      userPromise = fetch('/oauth2/userinfo').then(r => r.json())
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Promise.all([schemaPromise, userPromise]).then(([_, user]) => {
      setUser(user)
      setLoaded(true)
    })
  }, [])
  if (!loaded) {
    return <Loader />
  }
  return <LoadedApp user={user} />
}

export default App
