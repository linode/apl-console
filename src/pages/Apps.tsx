import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Apps from 'components/Apps'
import { useAuthz } from 'hooks/useApi'
import MainLayout from 'layouts/Empty'

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
