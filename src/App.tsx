/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import React, { Suspense, useState } from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import Cluster from 'pages/Cluster'
import Clusters from 'pages/Clusters'
import Dashboard from 'pages/Dashboard'
import Error from 'pages/Error'
import OtomiApp from 'pages/App'
import Apps from 'pages/Apps'
import Secret from 'pages/Secret'
import Secrets from 'pages/Secrets'
import Service from 'pages/Service'
import Services from 'pages/Services'
import Team from 'pages/Team'
import Teams from 'pages/Teams'
import Setting from 'pages/Setting'
import Job from 'pages/Job'
import Jobs from 'pages/Jobs'
import Policies from 'pages/Policies'
import Policy from 'pages/Policy'
import Shortcuts from 'pages/Shortcuts'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import { useLocalStorage } from 'hooks/useLocalStorage'
import useApi from 'hooks/useApi'
import { setSpec } from 'common/api-spec'
import { NotistackProvider, SnackbarUtilsConfigurator } from 'utils/snack'
import { getTheme, setThemeName, setThemeMode } from 'common/theme'
import Context from 'common/session-context'
import { ErrorBoundary } from 'react-error-boundary'

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
})

const App = () => {
  const [globalError, setGlobalError] = useState()
  const [dirty, setDirty] = useState()
  const [session, sessionLoading, sessionError]: any = useApi('getSession')
  const [apiDocs, apiDocsLoading, apiDocsError]: any = useApi('apiDocs')
  if (sessionError || apiDocsError) setGlobalError(sessionError ?? apiDocsError)
  const [themeType, setType] = useLocalStorage('themeType', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const [collapseSettings, setCollapseSettings] = useState(true)
  setThemeMode(themeType)
  if (sessionError || apiDocsError) {
    return <ErrorComponent />
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
    <Suspense fallback={<Loader />}>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={getTheme()}>
            <NotistackProvider>
              <SnackbarUtilsConfigurator />
              <CssBaseline />
              <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
              <Context.Provider
                value={{
                  ...session,
                  collapseSettings,
                  dirty: dirty === undefined ? session.isDirty : dirty,
                  globalError,
                  oboTeamId,
                  setCollapseSettings,
                  setDirty,
                  setGlobalError,
                  setOboTeamId,
                  setThemeMode: setType,
                  themeType,
                }}
              >
                <Router>
                  <Switch>
                    <Route path='/' component={Dashboard} exact />
                    <Route path='/apps/:teamId' component={Apps} exact />
                    <Route path='/apps/:teamId/:appId' component={OtomiApp} exact />
                    <Route path='/clusters' component={Clusters} exact />
                    <Route path='/cluster/:clusterId' component={Cluster} exact />
                    <Route path='/create-team' component={Team} exact />
                    <Route path='/jobs' component={Jobs} exact />
                    <Route path='/policies' component={Policies} exact />
                    <Route path='/policies/:policyId' component={Policy} exact />
                    <Route path='/services' component={Services} exact />
                    <Route path='/settings/:settingId' component={Setting} exact />
                    <Route path='/shortcuts/:teamId' component={Shortcuts} exact />
                    <Route path='/teams' component={Teams} exact />
                    <Route path='/teams/:teamId' component={Team} exact />
                    <Route path='/teams/:teamId/create-job' component={Job} exact />
                    <Route path='/teams/:teamId/create-secret' component={Secret} exact />
                    <Route path='/teams/:teamId/create-service' component={Service} exact />
                    <Route path='/teams/:teamId/jobs' component={Jobs} exact />
                    <Route path='/teams/:teamId/jobs/:jobId' component={Job} exact />
                    <Route path='/teams/:teamId/secrets' component={Secrets} exact />
                    <Route path='/teams/:teamId/secrets/:secretId' component={Secret} exact />
                    <Route path='/teams/:teamId/services' component={Services} exact />
                    <Route path='/teams/:teamId/services/:serviceId' component={Service} exact />
                    <Route path='*'>
                      <Error code={404} />
                    </Route>
                  </Switch>
                </Router>
              </Context.Provider>
            </NotistackProvider>
          </ThemeProvider>
        </CacheProvider>
      </ErrorBoundary>
    </Suspense>
  )
}

export default App
