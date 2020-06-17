import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Secret from '../components/Secret'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    clusters,
    user: { isAdmin, teamId: userTeamId },
    oboTeamId,
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  let err
  if (!isAdmin && teamId && teamId !== sessTeamId) {
    err = <Error code={401} />
  }
  const tid = teamId || sessTeamId
  const [formdata, setFormdata] = useState()
  const [createRes] = useApi('createSecret', !!formdata, { teamId: tid }, formdata)
  if (createRes) {
    return <Redirect to={`/teams/${sessTeamId}/secrets`} />
  }

  return <PaperLayout>{err || <Secret clusters={clusters} onSubmit={setFormdata} secret={formdata} />}</PaperLayout>
}
