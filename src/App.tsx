/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import cookie from 'cookie'
import ErrorComponent from 'components/Error'
import Backups from 'pages/Backups'
import Workloads from 'pages/Workloads'
import Builds from 'pages/Builds'
import OtomiApp from 'pages/App'
import Activate from 'pages/Activate'
import Apps from 'pages/Apps'
import Cluster from 'pages/Cluster'
import Clusters from 'pages/Clusters'
import Catalogs from 'pages/Catalogs'
import Catalog from 'pages/Catalog'
import Error from 'pages/Error'
import Secret from 'pages/Secret'
import Secrets from 'pages/Secrets'
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
import { Suspense } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ErrorBoundary } from 'react-error-boundary'
import Helmet from 'react-helmet'
import { Provider } from 'react-redux'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { store } from 'redux/store'
import { IoProvider } from 'socket.io-react-hook'
import Backup from 'pages/Backup'
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
                              <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
                              <Router basename={contextPath}>
                                <Switch>
                                  {/* ! user && <Route path='/' component={Home} exact /> */}
                                  <Route path='/' component={Dashboard} exact />
                                  <Route path='/activate' component={Activate} exact />
                                  <Route path='/apps/:teamId' component={Apps} exact />
                                  <Route path='/apps/:teamId/:appId' component={OtomiApp} exact />
                                  <Route path='/backups' component={Backups} exact />
                                  <Route path='/clusters/:clusterId' component={Cluster} exact />
                                  <Route path='/clusters' component={Clusters} exact />
                                  <Route path='/create-team' component={Team} exact />
                                  <Route path='/catalogs/:teamId' component={Catalogs} exact />
                                  <Route path='/catalogs/:teamId/:catalogName' component={Catalog} exact />
                                  <Route path='/catalogs/:teamId/:catalogName/:workloadId' component={Catalog} exact />
                                  <Route path='/services' component={Services} exact />
                                  <Route path='/secrets' component={Secrets} exact />
                                  <Route path='/workloads' component={Workloads} exact />
                                  <Route path='/settings' component={SettingsOverview} exact />
                                  <Route path='/projects' component={Projects} exact />
                                  <Route path='/builds' component={Builds} exact />
                                  <Route path='/settings/:settingId' component={Setting} exact />
                                  <Route path='/shortcuts/:teamId' component={Shortcuts} exact />
                                  <Route path='/teams' component={Teams} exact />
                                  <Route path='/teams/:teamId' component={Team} exact />
                                  <Route path='/teams/:teamId/create-backup' component={Backup} exact />
                                  <Route path='/teams/:teamId/create-secret' component={Secret} exact />
                                  <Route path='/teams/:teamId/create-service' component={Service} exact />
                                  <Route path='/teams/:teamId/create-project' component={Project} exact />
                                  <Route path='/teams/:teamId/create-build' component={Build} exact />
                                  <Route path='/teams/:teamId/secrets' component={Secrets} exact />
                                  <Route path='/teams/:teamId/secrets/:secretId' component={Secret} exact />
                                  <Route path='/teams/:teamId/backups' component={Backups} exact />
                                  <Route path='/teams/:teamId/backups/:backupId' component={Backup} exact />
                                  <Route path='/teams/:teamId/projects' component={Projects} exact />
                                  <Route path='/teams/:teamId/projects/:projectId' component={Project} exact />
                                  <Route path='/teams/:teamId/builds' component={Builds} exact />
                                  <Route path='/teams/:teamId/builds/:buildId' component={Build} exact />
                                  <Route path='/teams/:teamId/policies' component={Policies} exact />
                                  <Route path='/teams/:teamId/policies/:policyId' component={Policy} exact />
                                  <Route path='/teams/:teamId/workloads' component={Workloads} exact />
                                  <Route path='/teams/:teamId/services' component={Services} exact />
                                  <Route path='/teams/:teamId/services/:serviceId' component={Service} exact />
                                  <Route path='/maintenance' component={Maintenance} exact />

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
