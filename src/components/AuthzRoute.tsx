import { useSession } from 'providers/Session'
import React from 'react'
import { Route } from 'react-router-dom'
import Error from 'pages/Error'
import { HttpErrorForbidden } from 'utils/error'
import NavConfig from './NavConfig'

function PrivateRoute({ component: Component, platformAdminRoute, teamAdminRoute, ...rest }: any) {
  const navs = NavConfig()
  let isAbleToAccess = true
  navs.forEach((group) => {
    group.items.forEach((item) => {
      if (item.path === rest.location.pathname && item.hidden) isAbleToAccess = false
    })
  })
  const session = useSession()
  const {
    user: { isPlatformAdmin, isTeamAdmin },
    oboTeamId,
  } = session
  const isAuthenticated = (props) => {
    const {
      match: {
        params: { teamId },
      },
    } = props
    if (!isAbleToAccess) return false
    if (isPlatformAdmin) return true
    if (isTeamAdmin && teamAdminRoute) return true
    if (!platformAdminRoute && !teamAdminRoute && teamId && teamId === oboTeamId) return true
    return false
  }
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated(props) ? <Component {...props} /> : <Error error={new HttpErrorForbidden()} />
      }
    />
  )
}

export default PrivateRoute
