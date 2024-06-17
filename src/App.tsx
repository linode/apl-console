/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import cookie from 'cookie'
import ErrorComponent from 'components/Error'
import Backups from 'pages/Backups'
import Netpols from 'pages/Netpols'
import Workloads from 'pages/Workloads'
import Builds from 'pages/Builds'
import OtomiApp from 'pages/App'
import Apps from 'pages/Apps'
import Cluster from 'pages/Cluster'
import Clusters from 'pages/Clusters'
import Catalogs from 'pages/Catalogs'
import Catalog from 'pages/Catalog'
import Error from 'pages/Error'
import Secret from 'pages/Secret'
import SealedSecret from 'pages/SealedSecret'
import Secrets from 'pages/Secrets'
import SealedSecrets from 'pages/SealedSecrets'
import Service from 'pages/Service'
import Services from 'pages/Services'
import Setting from 'pages/Setting'
import SettingsOverview from 'pages/SettingsOverview'
import Shortcuts from 'pages/Shortcuts'
import Team from 'pages/Team'
import Teams from 'pages/Teams'
import Policies from 'pages/Policies'
import SessionProvider from 'providers/Session'
import ThemeProvider from 'theme'
import React, { Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ErrorBoundary } from 'react-error-boundary'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { store } from 'redux/store'
import { IoProvider } from 'socket.io-react-hook'
import Backup from 'pages/Backup'
import Netpol from 'pages/Netpol'
import Build from 'pages/Build'
import LoadingScreen from 'components/LoadingScreen'
import Dashboard from 'pages/Dashboard'
import Projects from 'pages/Projects'
import { CollapseDrawerProvider } from 'contexts/CollapseDrawerContext'
import { ShellDrawerProvider } from 'contexts/ShellDrawerContext'
import { SettingsProvider } from 'contexts/SettingsContext'
import { getSettings } from 'utils/getSettings'
import ThemeColorPresets from 'components/ThemeColorPresets'
import Project from 'pages/Project'
import Policy from 'pages/Policy'
import Maintenance from 'pages/Maintenance'
import PrivateRoute from 'components/AuthzRoute'
import { HttpErrorBadRequest } from './utils/error'
import { NotistackProvider, SnackbarUtilsConfigurator } from './utils/snack'

export const muiCache = createCache({
  key: 'mui',
  prepend: true,
})

let contextPath = '##CONTEXT_PATH##'
if (location.hostname === 'localhost') contextPath = ''

function App() {
  const cookies = cookie.parse(document.cookie)
  const settings = getSettings(cookies)

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ErrorBoundary FallbackComponent={ErrorComponent}>
        <CacheProvider value={muiCache}>
          <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
              <IoProvider>
                <SessionProvider>
                  <ShellDrawerProvider>
                    <CollapseDrawerProvider>
                      <SettingsProvider defaultSettings={settings}>
                        <ThemeProvider>
                          <ThemeColorPresets>
                            <NotistackProvider>
                              <SnackbarUtilsConfigurator />
                              <CssBaseline />
                              {/* <ProgressBar /> */}
                              <Helmet titleTemplate='%s | APL' defaultTitle='Akamai APL Platform' />
                              <Router basename={contextPath}>
                                <Switch>
                                  {/* ! user && <Route path='/' component={Home} exact /> */}
                                  <Route path='/' component={Dashboard} exact />
                                  <PrivateRoute path='/apps/:teamId' component={Apps} exact />
                                  <PrivateRoute path='/apps/:teamId/:appId' component={OtomiApp} exact />
                                  <PrivateRoute path='/backups' component={Backups} adminRoute exact />
                                  <PrivateRoute path='/clusters/:clusterId' component={Cluster} adminRoute exact />
                                  <PrivateRoute path='/clusters' component={Clusters} adminRoute exact />
                                  <PrivateRoute path='/create-team' component={Team} adminRoute exact />
                                  <PrivateRoute path='/netpols' component={Netpols} adminRoute exact />
                                  <PrivateRoute path='/policies' component={Policies} adminRoute exact />
                                  <PrivateRoute path='/policies/:policyId' component={Policy} adminRoute exact />
                                  <PrivateRoute path='/catalogs/:teamId' component={Catalogs} exact />
                                  <PrivateRoute path='/catalogs/:teamId/:catalogName' component={Catalog} exact />
                                  <PrivateRoute
                                    path='/catalogs/:teamId/:catalogName/:workloadId'
                                    component={Catalog}
                                    exact
                                  />
                                  <PrivateRoute path='/services' component={Services} adminRoute exact />
                                  <PrivateRoute path='/secrets' component={Secrets} adminRoute exact />
                                  <PrivateRoute path='/sealed-secrets' component={SealedSecrets} adminRoute exact />
                                  <PrivateRoute path='/workloads' component={Workloads} adminRoute exact />
                                  <PrivateRoute path='/settings' component={SettingsOverview} adminRoute exact />
                                  <PrivateRoute path='/projects' component={Projects} adminRoute exact />
                                  <PrivateRoute path='/builds' component={Builds} adminRoute exact />
                                  <PrivateRoute path='/settings/:settingId' component={Setting} exact />
                                  <PrivateRoute path='/shortcuts/:teamId' component={Shortcuts} exact />
                                  <PrivateRoute path='/teams' component={Teams} adminRoute exact />
                                  <PrivateRoute path='/teams/:teamId' component={Team} exact />
                                  <PrivateRoute path='/teams/:teamId/create-backup' component={Backup} exact />
                                  <PrivateRoute path='/teams/:teamId/create-netpol' component={Netpol} exact />
                                  <PrivateRoute path='/teams/:teamId/create-secret' component={Secret} exact />
                                  <PrivateRoute
                                    path='/teams/:teamId/create-sealedsecret'
                                    component={SealedSecret}
                                    exact
                                  />
                                  <PrivateRoute path='/teams/:teamId/create-service' component={Service} exact />
                                  <PrivateRoute path='/teams/:teamId/create-project' component={Project} exact />
                                  <PrivateRoute path='/teams/:teamId/create-build' component={Build} exact />
                                  <PrivateRoute path='/teams/:teamId/secrets' component={Secrets} exact />
                                  <PrivateRoute path='/teams/:teamId/sealed-secrets' component={SealedSecrets} exact />
                                  <PrivateRoute path='/teams/:teamId/secrets/:secretId' component={Secret} exact />
                                  <PrivateRoute
                                    path='/teams/:teamId/sealed-secrets/:secretId'
                                    component={SealedSecret}
                                    exact
                                  />
                                  <PrivateRoute path='/teams/:teamId/backups' component={Backups} exact />
                                  <PrivateRoute path='/teams/:teamId/backups/:backupId' component={Backup} exact />
                                  <PrivateRoute path='/teams/:teamId/netpols' component={Netpols} exact />
                                  <PrivateRoute path='/teams/:teamId/netpols/:netpolId' component={Netpol} exact />
                                  <PrivateRoute path='/teams/:teamId/projects' component={Projects} exact />
                                  <PrivateRoute path='/teams/:teamId/projects/:projectId' component={Project} exact />
                                  {/* <Route path='/teams/:teamId/builds' component={Builds} exact /> */}
                                  <PrivateRoute exact path='/teams/:teamId/builds' component={Builds} />
                                  <PrivateRoute path='/teams/:teamId/builds/:buildId' component={Build} exact />
                                  <PrivateRoute path='/teams/:teamId/policies' component={Policies} exact />
                                  <PrivateRoute path='/teams/:teamId/policies/:policyId' component={Policy} exact />
                                  <PrivateRoute path='/teams/:teamId/workloads' component={Workloads} exact />
                                  <PrivateRoute path='/teams/:teamId/services' component={Services} exact />
                                  <PrivateRoute path='/teams/:teamId/services/:serviceId' component={Service} exact />
                                  <PrivateRoute path='/maintenance' component={Maintenance} adminRoute exact />
                                  <Route path='*'>
                                    <Error error={new HttpErrorBadRequest()} />
                                  </Route>
                                </Switch>
                              </Router>
                            </NotistackProvider>
                          </ThemeColorPresets>
                        </ThemeProvider>
                      </SettingsProvider>
                    </CollapseDrawerProvider>
                  </ShellDrawerProvider>
                </SessionProvider>
              </IoProvider>
            </DndProvider>
          </Provider>
        </CacheProvider>
      </ErrorBoundary>
    </Suspense>
  )
}

export default App
