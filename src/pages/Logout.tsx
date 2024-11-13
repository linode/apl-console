import { useEffect } from 'react'

export default function Logout() {
  // This component will redirect the user to the Keycloak logout page
  useEffect(() => {
    window.location.href = '/logout-otomi'
  }, [])
  return null
}
