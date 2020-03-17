import { Backdrop, CircularProgress, CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { SnackbarProvider } from 'notistack'
import * as React from 'react'
import Helmet from 'react-helmet'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'
import { getSession, useSession } from '../auth'
import { theme } from '../theme'
import { userContext } from '../user-context'
import Service from './Services/Service'
import Services from './Services/Services'

const App: React.FC = (): any => {
  const [user, initialising, error] = getSession()

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Helmet titleTemplate='%s | Otomi' defaultTitle='Otomi' />
        {initialising ? (
          <Backdrop open={initialising} style={{ zIndex: 1500 }}>
            <CircularProgress />
          </Backdrop>
        ) : (
          <userContext.Provider
            value={{
              initialising,
              user,
            }}
          >
            <Router>
              <Switch>
                {/*!user && <Route path='/' component={Home} exact />*/}
                <Route path='/services' component={Services} exact />
                <Route path='/services/{id}' component={Service} exact />
                <Route path='/services/{id}' component={Service} exact />
                <Route path='*'>404 page here</Route>
              </Switch>
            </Router>
          </userContext.Provider>
        )}
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
