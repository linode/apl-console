import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'

interface Props {
  fetchError?: boolean
}

export default function Logout({ fetchError = false }: Props): React.ReactElement {
  // This component manages the logout process for users authenticated with Keycloak.
  // - If a fetch error occurs, the page reloads automatically to handle potential session issues.
  // - If no fetch error occurs, the user is redirected to the Keycloak logout page ('/platform-logout' route).
  // - On component unmount, the page reloads to ensure a clean and consistent state.
  useEffect(() => {
    if (fetchError) window.location.reload()
    else window.location.href = '/platform-logout'
    return () => {
      window.location.reload()
    }
  }, [fetchError])
  return <LoadingScreen />
}
