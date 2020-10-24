/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { useApi } from './hooks/api'
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
import ErrorComponent from './components/Error'
import Context from './session-context'
import { getTheme, setThemeName, setThemeType } from './theme'
import { NotistackProvider, SnackbarUtilsConfigurator } from './utils/snack'
import { setSpec } from './api-spec'
import Catch from './utils/error'
import devTokens from './devtokens'

const env = process.env
let mode = 'ee'
if (process.env.NODE_ENV === 'development') {
  if (location.search.includes('mode')) {
    mode = new URLSearchParams(location.search).get('mode')
  }
} else {
  mode = '##CONSOLE_MODE##' // will be replaced at deploy time
  if (mode.includes('##')) {
    console.warn('No CONSOLE_MODE known. Defaulting to CE.')
    mode = 'ce'
  }
}

const AppEE = () => {
  const [session, sessionLoading, sessionError]: any = useApi('getSession')
  const [apiDocs, apiDocsLoading, apiDocsError]: any = useApi('apiDocsGet')
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  setThemeType(themeType)
  if (sessionError || apiDocsError) {
    return <ErrorComponent code={500} />
  }
  if (sessionLoading || apiDocsLoading) {
    return <Loader />
  }
  setSpec(apiDocs)
  const { user } = session
  if (!user.isAdmin && !oboTeamId) {
    setOboTeamId(user.teams[0])
    return <Loader />
  }
  setThemeName(user.isAdmin ? 'admin' : 'team')
  return (
    <ThemeProvider theme={getTheme()}>
      <NotistackProvider>
        <SnackbarUtilsConfigurator />
        <CssBaseline />
        <Helmet titleTemplate='%s | otomi' defaultTitle='otomi' />
        <Context.Provider
          value={{
            ...session,
            mode,
            oboTeamId,
            setOboTeamId,
            themeType,
            setThemeType: setType,
          }}
        >
          <Catch>
            <Router basename={env.CONTEXT_PATH || ''}>
              <Switch>
                {/* ! user && <Route path='/' component={Home} exact /> */}
                <Route path='/' component={Dashboard} exact />
                <Route path='/apps/:teamId' component={OtomiApps} exact />
                <Route path='/clusters' component={Clusters} exact />
                <Route path='/cluster/:clusterId' component={Cluster} exact />
                <Route path='/create-team' component={Team} exact />
                <Route path='/services' component={Services} exact />
                <Route path='/settings' component={Settings} exact />
                <Route path='/teams' component={Teams} exact />
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
          </Catch>
        </Context.Provider>
      </NotistackProvider>
    </ThemeProvider>
  )
}

const AppCE = () => {
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const [session, setSession] = useState() as any
  setThemeType(themeType)
  useEffect(() => {
    const loadSession: any = async () => {
      const response = await fetch(
        `${env.CONTEXT_PATH || ''}/session${env.NODE_ENV === 'development' && `?token=${devTokens.admin}`}`,
      )
      const session = await response.json()
      const { user, clusters } = session
      const c = clusters[0]
      session.currentClusterId = `${c.cloud}/${c.name}`
      const { groups } = user
      if (groups.includes('admin') || groups.includes('team-admin')) {
        user.isAdmin = true
        user.roles = ['team']
        if (groups.includes('admin')) {
          user.roles.push('admin')
        }
        if (groups.includes('team-admin')) {
          user.roles.push('team-admin')
        }
      }
      setSession(session)
    }
    loadSession()
  }, [setSession])
  if (!session) {
    return <Loader />
  }
  const { user } = session
  if (!user.isAdmin && !oboTeamId) {
    setOboTeamId(user.teams[0])
    return <Loader />
  }
  setThemeName(user.isAdmin ? 'admin' : 'team')
  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <Helmet titleTemplate='%s | otomi' defaultTitle='otomi' />
      <Context.Provider
        value={{
          ...session,
          mode,
          oboTeamId,
          setOboTeamId,
          themeType,
          setThemeType: setType,
        }}
      >
        <Catch>
          <Router basename={env.CONTEXT_PATH || ''}>
            <Switch>
              {/* ! user && <Route path='/' component={Home} exact /> */}
              <Route path='/apps/:teamId' component={OtomiApps} />
              <Route path='*'>
                <Redirect to={`/apps/${oboTeamId || `${user.isAdmin ? 'admin' : ''}`}`} />
              </Route>
            </Switch>
          </Router>
        </Catch>
      </Context.Provider>
    </ThemeProvider>
  )
}

const App = mode === 'ce' ? AppCE : AppEE
export default App
