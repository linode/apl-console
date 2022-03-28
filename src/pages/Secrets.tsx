import Secrets from 'components/Secrets'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useGetSecretsQuery } from 'redux/otomiApi'

interface Params {
  teamId: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const { data, isLoading, error } = useGetSecretsQuery({ teamId })
  const comp = !(isLoading || error) && data && <Secrets teamId={teamId} secrets={data} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
