import LoadingScreen from 'components/LoadingScreen'
import React, { useEffect } from 'react'
import { useLogoutMutation } from 'redux/otomiApi'

interface Props {
  fetchError?: boolean
}

export default function Logout({ fetchError = false }: Props): React.ReactElement {
  const [logout] = useLogoutMutation()
  useEffect(() => {
    if (fetchError) window.location.reload()
    else logout().finally(() => window.location.assign('/platform-logout'))
    return () => {
      window.location.reload()
    }
  }, [fetchError])
  return <LoadingScreen />
}
