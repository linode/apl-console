import { useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setDirty, setError } from 'redux/reducers'

export default function Logout() {
  // This component will redirect the user to the Keycloak logout page
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setError(undefined))
    dispatch(setDirty(false))
    window.location.href = '/logout-otomi'
  }, [])
  return null
}
