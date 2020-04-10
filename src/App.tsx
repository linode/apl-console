import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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
import Error from './pages/Error'
import { SessionContext } from './session-context'
import { createClasses, setThemeName, getTheme, setThemeType } from './theme'
import { defaultOpts, SnackbarProvider, styles } from './utils/snackbar'
import { useLocalStorage } from './hooks/useLocalStorage'

const allClusters = [
  {
    cloud: 'azure',
    cluster: 'dev',
    domain: 'dev.aks.otomi.cloud',
    k8sVersion: '1.15',
    region: 'westeurope',
    id: 'dev/azure',
  },
  {
    cloud: 'azure',
    cluster: 'prd',
    domain: 'prd.aks.otomi.cloud',
    k8sVersion: '1.15',
    region: 'westeurope',
    id: 'prd/azure',
  },
  {
    cloud: 'aws',
    cluster: 'dev',
    domain: 'dev.eks.otomi.cloud',
    k8sVersion: '1.14',
    region: 'eu-central-1',
    id: 'dev/aws',
  },
  {
    cloud: 'aws',
    cluster: 'prd',
    domain: 'prd.eks.otomi.cloud',
    k8sVersion: '1.14',
    region: 'eu-central-1',
    id: 'prd/aws',
  },
  {
    cloud: 'google',
    cluster: 'dev',
    domain: 'dev.gke.otomi.cloud',
    k8sVersion: '1.15',
    region: 'europe-west4',
    id: 'dev/google',
  },
  {
    cloud: 'google',
    cluster: 'prd',
    domain: 'prd.gke.otomi.cloud',
    k8sVersion: '1.15',
    region: 'europe-west4',
    id: 'prd/google',
  },
]
const testSessions = [
  {
    user: { email: 'bob.admin@redkubes.com' },
    isAdmin: true,
    clusters: allClusters,
  },
  {
    user: { email: 'dan.team@redkubes.com' },
    teamId: 'taxi',
    isAdmin: false,
    clusters: allClusters,
  },
]

const App = (): any => {
  // const [session, initialising, error] = useApi('getSession')
  const initialising = false
  const [loaded, setLoaded] = useState(false)
  const [sessionIdx, setSessionIdx] = useLocalStorage('sessionIdx', 0)
  const [themeName, setTheme] = useLocalStorage('themeName', 'admin')
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [teamId, setTeamId] = useLocalStorage('teamId', undefined)
  const session = testSessions[sessionIdx]
  testSessions[0].teamId = teamId
  setThemeName(themeName)
  setThemeType(themeType)
  const classes = createClasses(styles)
  const changeSession = (isAdmin, teamId = null): any => {
    if (isAdmin) {
      setTeamId(teamId)
      setSessionIdx(0)
      return
    }
    const newSessionIdx = sessionIdx === 0 ? 1 : 0
    setTheme(newSessionIdx === 0 ? 'admin' : 'team')
    setSessionIdx(newSessionIdx)
  }
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
              initialising,
              changeSession,
              setThemeName: setTheme,
              setThemeType: setType,
            }}
          >
            <Router>
              <Switch>
                {/*! user && <Route path='/' component={Home} exact /> */}
                <Route path='/' component={Dashboard} exact />
                <Route path='/otomi/apps' component={OtomiApps} exact />
                <Route path='/clusters' component={Clusters} exact />
                <Route path='/services' component={Services} teamId={teamId} exact />
                <Route path='/teams' component={Teams} exact />
                <Route path='/create-team' component={Team} exact />
                <Route path='/create-service' component={Service} exact />
                <Route path='/teams/:teamId' component={Team} exact />
                <Route path='/teams/:teamId/services' component={Services} exact />
                <Route path='/teams/:teamId/services/:serviceName' component={Service} exact />
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

export default App
