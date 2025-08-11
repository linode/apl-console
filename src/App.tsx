/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import cookie from 'cookie'
import Backups from 'pages/Backups'
import Workloads from 'pages/Workloads'
import OtomiApp from 'pages/App'
import Apps from 'pages/Apps'
import Cluster from 'pages/Cluster'
import Clusters from 'pages/Clusters'
import Catalogs from 'pages/Catalogs'
import Catalog from 'pages/Catalog'
import Error from 'pages/Error'
import Setting from 'pages/Setting'
import SettingsOverview from 'pages/SettingsOverview'
import Policies from 'pages/Policies'
import SessionProvider from 'providers/Session'
import SocketProvider from 'providers/Socket'
import ThemeProvider from 'theme'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { store } from 'redux/store'
import Backup from 'pages/Backup'
import LoadingScreen from 'components/LoadingScreen'
import Dashboard from 'pages/Dashboard'
import Users from 'pages/Users'
import { CollapseDrawerProvider } from 'contexts/CollapseDrawerContext'
import { ShellDrawerProvider } from 'contexts/ShellDrawerContext'
import { SettingsProvider } from 'contexts/SettingsContext'
import { getSettings } from 'utils/getSettings'
import ThemeColorPresets from 'components/ThemeColorPresets'
import User from 'pages/User'
import Policy from 'pages/Policy'
import Maintenance from 'pages/Maintenance'
import PrivateRoute from 'components/AuthzRoute'
import Logout from 'pages/Logout'
import BuildsCreateEditPage from 'pages/builds/create-edit/BuildsCreateEditPage'
import BuildsOverviewPage from 'pages/builds/overview/BuildsOverviewPage'
import CodeRepositoriesCreateEditPage from 'pages/code-repositories/create-edit/CodeRepositoriesCreateEditPage'
import CodeRepositoriesOverviewPage from 'pages/code-repositories/overview/CodeRepositoriesOverviewPage'
import NetworkPoliciesOverviewPage from 'pages/network-policies/overview/NetworkPoliciesOverviewPage'
import NetworkPoliciesIngressCreateEditPage from 'pages/network-policies/create-edit/NetworkPoliciesIngressCreateEditPage'
import NetworkPoliciesEgressCreateEditPage from 'pages/network-policies/create-edit/NetworkPoliciesEgressCreateEditPage'
import SecretOverviewPage from 'pages/secrets/overview/SecretOverviewPage'
import SecretCreateEditPage from 'pages/secrets/create-edit/SecretCreateEditPage'
import ServicesCreateEditPage from 'pages/services/create-edit/ServicesCreateEditPage'
import ServicesOverviewPage from 'pages/services/overview/ServicesOverviewPage'
import TeamsCreateEditPage from 'pages/teams/create-edit/TeamsCreateEditPage'
import TeamsOverviewPage from 'pages/teams/overview/TeamsOverviewPage'
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
                    <SocketProvider>
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
                                  path='/code-repositories'
                                  component={CodeRepositoriesOverviewPage}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/code-repositories'
                                  component={CodeRepositoriesOverviewPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/code-repositories/create'
                                  component={CodeRepositoriesCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/code-repositories/:codeRepositoryName'
                                  component={CodeRepositoriesCreateEditPage}
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
                                <PrivateRoute
                                  path='/teams/create'
                                  component={TeamsCreateEditPage}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute
                                  path='/network-policies'
                                  component={NetworkPoliciesOverviewPage}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/policies' component={Policies} platformAdminRoute exact />
                                <PrivateRoute
                                  path='/policies/:policyName'
                                  component={Policy}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/catalogs/:teamId' component={Catalogs} exact />
                                <PrivateRoute path='/catalogs/:teamId/:catalogName' component={Catalog} exact />
                                <PrivateRoute
                                  path='/catalogs/:teamId/:catalogName/:workloadName'
                                  component={Catalog}
                                  exact
                                />
                                <PrivateRoute
                                  path='/services'
                                  component={ServicesOverviewPage}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/secrets' component={SecretOverviewPage} platformAdminRoute exact />
                                <PrivateRoute path='/workloads' component={Workloads} platformAdminRoute exact />
                                <PrivateRoute path='/settings' component={SettingsOverview} platformAdminRoute exact />
                                <PrivateRoute path='/users' component={Users} platformAdminRoute exact />
                                <PrivateRoute path='/users/:userId' component={User} platformAdminRoute exact />
                                <PrivateRoute path='/teams/:teamId/users' component={Users} teamAdminRoute exact />
                                <PrivateRoute
                                  path='/container-images'
                                  component={BuildsOverviewPage}
                                  platformAdminRoute
                                  exact
                                />
                                <PrivateRoute path='/settings/:settingId' component={Setting} exact />
                                <PrivateRoute path='/teams' component={TeamsOverviewPage} platformAdminRoute exact />
                                <PrivateRoute path='/teams/:teamId' component={TeamsCreateEditPage} exact />
                                <PrivateRoute path='/teams/:teamId/backups/create' component={Backup} exact />
                                <PrivateRoute
                                  path='/teams/:teamId/network-policies/inbound-rules/create'
                                  component={NetworkPoliciesIngressCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/network-policies/outbound-rules/create'
                                  component={NetworkPoliciesEgressCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/secrets/create'
                                  component={SecretCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/services/create'
                                  component={ServicesCreateEditPage}
                                  exact
                                />
                                <PrivateRoute path='/teams/:teamId/users/create' component={User} exact />
                                <PrivateRoute
                                  path='/teams/:teamId/container-images/create'
                                  component={BuildsCreateEditPage}
                                  exact
                                />
                                <PrivateRoute path='/teams/:teamId/secrets' component={SecretOverviewPage} exact />
                                <PrivateRoute
                                  path='/teams/:teamId/secrets/:sealedSecretName'
                                  component={SecretCreateEditPage}
                                  exact
                                />
                                <PrivateRoute path='/teams/:teamId/backups' component={Backups} exact />
                                <PrivateRoute path='/teams/:teamId/backups/:backupName' component={Backup} exact />
                                <PrivateRoute
                                  path='/teams/:teamId/network-policies'
                                  component={NetworkPoliciesOverviewPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/network-policies/inbound-rules/:networkPolicyName'
                                  component={NetworkPoliciesIngressCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/network-policies/outbound-rules/:networkPolicyName'
                                  component={NetworkPoliciesEgressCreateEditPage}
                                  exact
                                />
                                <PrivateRoute
                                  exact
                                  path='/teams/:teamId/container-images'
                                  component={BuildsOverviewPage}
                                />
                                <PrivateRoute
                                  path='/teams/:teamId/container-images/:buildName'
                                  component={BuildsCreateEditPage}
                                  exact
                                />
                                <PrivateRoute path='/teams/:teamId/policies' component={Policies} exact />
                                <PrivateRoute path='/teams/:teamId/policies/:policyName' component={Policy} exact />
                                <PrivateRoute path='/teams/:teamId/workloads' component={Workloads} exact />
                                <PrivateRoute path='/teams/:teamId/services' component={ServicesOverviewPage} exact />
                                <PrivateRoute
                                  path='/teams/:teamId/services/:serviceName'
                                  component={ServicesCreateEditPage}
                                  exact
                                />
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
                    </SocketProvider>
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
