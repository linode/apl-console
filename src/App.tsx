/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import cookie from 'cookie'
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
import Team from 'pages/Team'
import Teams from 'pages/Teams'
import Policies from 'pages/Policies'
import SessionProvider from 'providers/Session'
import ThemeProvider from 'theme'
import React, { Suspense } from 'react'
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
import Users from 'pages/Users'
import Projects from 'pages/Projects'
import { CollapseDrawerProvider } from 'contexts/CollapseDrawerContext'
import { ShellDrawerProvider } from 'contexts/ShellDrawerContext'
import { SettingsProvider } from 'contexts/SettingsContext'
import { getSettings } from 'utils/getSettings'
import ThemeColorPresets from 'components/ThemeColorPresets'
import User from 'pages/User'
import Project from 'pages/Project'
import Policy from 'pages/Policy'
import Maintenance from 'pages/Maintenance'
import PrivateRoute from 'components/AuthzRoute'
import Logout from 'pages/Logout'
import CodeRepository from 'pages/code-repositories/create-edit'
import CodeRepositories from 'pages/code-repositories/overview'
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
      <Provider store={store}>
        <SettingsProvider defaultSettings={settings}>
          <ThemeProvider>
            <ThemeColorPresets>
              <Router basename={contextPath}>
                <ErrorBoundary FallbackComponent={Error}>
                  <CacheProvider value={muiCache}>
                    <IoProvider>
                      <SessionProvider>
                        <ShellDrawerProvider>
                          <CollapseDrawerProvider>
                            <NotistackProvider>
                              <SnackbarUtilsConfigurator />
                              <CssBaseline />
                              <Helmet titleTemplate='%s | APL' defaultTitle='Akamai APL Platform' />
                              <Switch>
                                <Route path='/' component={Dashboard} exact />
                                <PrivateRoute
                                  path='/coderepositories'
                                  component={CodeRepositories}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/coderepositories'
                                  component={CodeRepositories}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/create-coderepository'
                                  component={CodeRepository}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/coderepositories/:coderepositoryId'
                                  component={CodeRepository}
                                  exact
                                />

                                <PrivateRoute path='/apps/:teamId' component={Apps} exact />
                                <PrivateRoute path='/apps/:teamId/:appId' component={OtomiApp} exact />
                                <PrivateRoute path='/backups' component={Backups} platformAdminRoute exact />
                                <PrivateRoute
                                  path='/clusters/:clusterId'
                                  component={Cluster}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/clusters' component={Clusters} platformAdminRoute exact />
                                <PrivateRoute path='/create-team' component={Team} platformAdminRoute exact />
                                <PrivateRoute path='/netpols' component={Netpols} platformAdminRoute exact />
                                <PrivateRoute path='/policies' component={Policies} platformAdminRoute exact />
                                <PrivateRoute path='/policies/:policyId' component={Policy} platformAdminRoute exact />
                                <PrivateRoute path='/catalogs/:teamId' component={Catalogs} exact />
                                <PrivateRoute path='/catalogs/:teamId/:catalogName' component={Catalog} exact />
                                <PrivateRoute
                                  path='/catalogs/:teamId/:catalogName/:workloadName'
                                  component={Catalog}
                                  exact
                                />
                                <PrivateRoute path='/services' component={Services} platformAdminRoute exact />
                                <PrivateRoute path='/secrets' component={Secrets} platformAdminRoute exact />
                                <PrivateRoute
                                  path='/sealed-secrets'
                                  component={SealedSecrets}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/workloads' component={Workloads} platformAdminRoute exact />
                                <PrivateRoute path='/settings' component={SettingsOverview} platformAdminRoute exact />
                                <PrivateRoute path='/users' component={Users} platformAdminRoute exact />
                                <PrivateRoute path='/users/:userId' component={User} platformAdminRoute exact />
                                <PrivateRoute path='/teams/:teamId/users' component={Users} teamAdminRoute exact />
                                <PrivateRoute path='/projects' component={Projects} platformAdminRoute exact />
                                <PrivateRoute path='/builds' component={Builds} platformAdminRoute exact />
                                <PrivateRoute path='/settings/:settingId' component={Setting} exact />
                                <PrivateRoute path='/teams' component={Teams} platformAdminRoute exact />
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
                                <PrivateRoute path='/teams/:teamId/create-user' component={User} exact />
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
                                <PrivateRoute path='/teams/:teamId/builds/:buildName' component={Build} exact />
                                <PrivateRoute path='/teams/:teamId/policies' component={Policies} exact />
                                <PrivateRoute path='/teams/:teamId/policies/:policyId' component={Policy} exact />
                                <PrivateRoute path='/teams/:teamId/workloads' component={Workloads} exact />
                                <PrivateRoute path='/teams/:teamId/services' component={Services} exact />
                                <PrivateRoute path='/teams/:teamId/services/:serviceId' component={Service} exact />
                                <PrivateRoute path='/maintenance' component={Maintenance} platformAdminRoute exact />
                                <Route path='/logout' component={Logout} />
                                <Route path='*'>
                                  <Error error={new HttpErrorBadRequest()} />
                                </Route>
                              </Switch>
                            </NotistackProvider>
                          </CollapseDrawerProvider>
                        </ShellDrawerProvider>
                      </SessionProvider>
                    </IoProvider>
                  </CacheProvider>
                </ErrorBoundary>
              </Router>
            </ThemeColorPresets>
          </ThemeProvider>
        </SettingsProvider>
      </Provider>
    </Suspense>
  )
}

export default App
