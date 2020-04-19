import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { schemaPromise, useApi } from './hooks/api'
import { useLocalStorage } from './hooks/useLocalStorage'
// import { useApi } from './hooks/api'
import Clusters from './pages/Clusters'
import Dashboard from './pages/Dashboard'
import Error from './pages/Error'
import OtomiApps from './pages/OtomiApps'
import Service from './pages/Service'
import Services from './pages/Services'
import Team from './pages/Team'
import Teams from './pages/Teams'
import TeamServices from './pages/TeamServices'
import { SessionContext } from './session-context'
import { createClasses, getTheme, setThemeName, setThemeType } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'

const LoadedApp = (): any => {
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
              oboTeamId,
              setOboTeamId,
              setThemeType: setType,
            }}
          >
            <Router>
              <Switch>
                {/*! user && <Route path='/' component={Home} exact /> */}
                <Route path='/' component={Dashboard} exact />
                <Route path='/otomi/apps' component={OtomiApps} exact />
                <Route path='/clusters' component={Clusters} exact />
                <Route path='/services' component={Services} exact />
                <Route path='/teams' component={Teams} exact />
                <Route path='/create-team' component={Team} exact />
                <Route path='/create-service' component={Service} exact />
                <Route path='/teams/:teamId' component={Team} exact />
                <Route path='/teams/:teamId/create-service' component={Service} exact />
                <Route path='/teams/:teamId/services' component={TeamServices} exact />
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
  useEffect(() => {
    ;(async (): Promise<any> => {
      await schemaPromise
      setLoaded(true)
    })()
  })
  if (!loaded) {
    return <Loader />
  }
  return <LoadedApp />
}

export default App
