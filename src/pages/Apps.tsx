import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Apps from '../components/Apps'
import MainLayout from '../layouts/Empty'
import { useAuthz } from '../hooks/api'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { tid } = useAuthz(teamId)
  return (
    <MainLayout>
      <Apps teamId={tid} />
    </MainLayout>
  )
}
