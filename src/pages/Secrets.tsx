import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Secrets from 'components/Secrets'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { tid } = useAuthz(teamId)
  const secretsMethod = !teamId ? 'getAllSecrets' : 'getSecrets'
  const [secrets, secretsLoading, secretsError]: any = useApi(secretsMethod, true, [tid])
  const comp = !(secretsError || secretsLoading) && <Secrets teamId={teamId} secrets={secrets} />
  return <PaperLayout loading={secretsLoading} comp={comp} />
}
