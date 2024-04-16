import Forbidden from 'components/Forbidden'
import { useSession } from 'providers/Session'
import React from 'react'
import { Route } from 'react-router-dom'

function PrivateRoute({ component: Component, adminRoute, ...rest }: any) {
  const session = useSession()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  const isAuthenticated = (props) => {
    const {
      match: {
        params: { teamId },
      },
    } = props
    if ((adminRoute && !isAdmin) || (!isAdmin && teamId && teamId !== oboTeamId)) return false
    return true
  }
  return (
    <Route
      {...rest}
      render={(props) => (isAuthenticated(props) ? <Component {...props} /> : React.createElement(Forbidden))}
    />
  )
}

export default PrivateRoute
