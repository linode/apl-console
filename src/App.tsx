/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { setSpec } from 'common/api-spec'
import Context from 'common/session-context'
import { getTheme, setThemeMode, setThemeName } from 'common/theme'
import ErrorComponent from 'components/Error'
import Loader from 'components/Loader'
import useApi from 'hooks/useApi'
import { useLocalStorage } from 'hooks/useLocalStorage'
import OtomiApp from 'pages/App'
import Apps from 'pages/Apps'
import Cluster from 'pages/Cluster'
import Clusters from 'pages/Clusters'
import Dashboard from 'pages/Dashboard'
import Error from 'pages/Error'
import Job from 'pages/Job'
import Jobs from 'pages/Jobs'
import Policies from 'pages/Policies'
import Policy from 'pages/Policy'
import Secret from 'pages/Secret'
import Secrets from 'pages/Secrets'
import Service from 'pages/Service'
import Services from 'pages/Services'
import Setting from 'pages/Setting'
import Shortcuts from 'pages/Shortcuts'
import Team from 'pages/Team'
import Teams from 'pages/Teams'
import React, { Dispatch, Suspense, useMemo, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ErrorApiBadGateway, ErrorApiNotExists, ErrorUnauthorized } from './utils/error'
import { NotistackProvider, SnackbarUtilsConfigurator } from './utils/snack'

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
})

let contextPath = '##CONTEXT_PATH##'
if (location.hostname === 'localhost') contextPath = ''

function App() {
  const [globalError, setGlobalError] = useState()
  const [dirty, setDirty] = useState()
  const [session, sessionLoading, sessionError]: any = useApi('getSession')
  const [apiDocs, apiDocsLoading, apiDocsError]: any = useApi('apiDocs')
  const [themeMode, setMode]: [string, Dispatch<any>] = useLocalStorage('themeMode', 'light')
  const [oboTeamId, setOboTeamId] = useLocalStorage('oboTeamId', undefined)
  const ctx = useMemo(
    () => ({
      ...(session || {}),
      dirty: dirty === undefined ? session?.isDirty : dirty,
      globalError,
      oboTeamId,
      setDirty,
      setGlobalError,
      setOboTeamId,
      setThemeMode: setMode,
      themeMode,
    }),
    [session, dirty, globalError, oboTeamId, themeMode],
  )
  setThemeMode(themeMode)
  if (sessionLoading || apiDocsLoading) return <Loader />
  let err
  if (sessionError || apiDocsError) {
    const e = sessionError || apiDocsError
    if (e.code === 504) err = <ErrorComponent error={new ErrorApiBadGateway()} />
    err = <ErrorComponent error={err} />
  }
  if (apiDocs) setSpec(apiDocs)
  if (!err) {
    const { user } = session
    if (!user.isAdmin && !oboTeamId) {
      if (user.teams.length) {
        setOboTeamId(user.teams[0])
        return <Loader />
      }
      err = <ErrorComponent error={new ErrorUnauthorized()} />
    }
    setThemeName(user.isAdmin ? 'admin' : 'team')
  }
  return (
    <Suspense fallback={<Loader />}>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <CacheProvider value={muiCache}>
          <ThemeProvider theme={getTheme()}>
            <NotistackProvider>
              <SnackbarUtilsConfigurator />
              <CssBaseline />
              <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
              {err}
              {!err && session && (
                <Context.Provider value={ctx}>
                  <Router basename={contextPath}>
                    <Switch>
                      {/* ! user && <Route path='/' component={Home} exact /> */}
                      <Route path='/' component={Dashboard} exact />
                      <Route path='/apps/:teamId' component={Apps} exact />
                      <Route path='/apps/:teamId/:appId' component={OtomiApp} exact />
                      <Route path='/cluster/:clusterId' component={Cluster} exact />
                      <Route path='/clusters' component={Clusters} exact />
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
                        <Error error={new ErrorApiNotExists()} />
                      </Route>
                    </Switch>
                  </Router>
                </Context.Provider>
              )}
            </NotistackProvider>
          </ThemeProvider>
        </CacheProvider>
      </ErrorBoundary>
    </Suspense>
  )
}

export default App
