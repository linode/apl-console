import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setDirty, setError } from 'redux/reducers'

interface Props {
  fetchError?: boolean
}

export default function Logout({ fetchError = false }: Props): React.ReactElement {
  // This component will redirect the user to the Keycloak logout page
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setDirty(false))
    dispatch(setError(undefined))
    if (fetchError) {
      // automatically triggers Keycloak to route the user to the Keycloak login page
      window.location.reload()
    } else window.location.href = '/logout-otomi'
    return () => {
      dispatch(setDirty(false))
      dispatch(setError(undefined))
      window.location.reload()
    }
  }, [fetchError])
  return <LoadingScreen />
}
