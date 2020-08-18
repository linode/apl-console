import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import React from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
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

const env = process.env

const App = () => {
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
        <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
        <Context.Provider
          value={{
            ...session,
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

export default App
