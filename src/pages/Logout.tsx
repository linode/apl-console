import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setDirty, setError } from 'redux/reducers'

interface Props {
  waitAndLogout?: boolean
}

export default function Logout({ waitAndLogout = false }: Props): React.ReactElement {
  // This component will redirect the user to the Keycloak logout page
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setDirty(false))
    dispatch(setError(undefined))
    if (waitAndLogout) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else window.location.href = '/logout-otomi'
    return () => {
      dispatch(setDirty(false))
      dispatch(setError(undefined))
      window.location.reload()
    }
  }, [waitAndLogout])
  return <LoadingScreen />
}
