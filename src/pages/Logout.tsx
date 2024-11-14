import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'

interface Props {
  fetchError?: boolean
}

export default function Logout({ fetchError = false }: Props): React.ReactElement {
  // This component will redirect the user to the Keycloak logout page
  useEffect(() => {
    if (fetchError) {
      // automatically triggers Keycloak to route the user to the Keycloak login page
      window.location.reload()
    } else window.location.href = '/logout-otomi'
    return () => {
      window.location.reload()
    }
  }, [fetchError])
  return <LoadingScreen />
}
