import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Secret from '../components/Secret'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) => {
  const {
    sess: { oboTeamId },
    tid,
  } = useAuthz(teamId)
  const [formdata, setFormdata] = useState()
  const [res, loading, err] = useApi('createSecret', !!formdata, [tid, formdata])
  if (res && !(loading || err)) {
    return <Redirect to={`/teams/${oboTeamId}/secrets`} />
  }
  const comp = !(err || loading) && <Secret onSubmit={setFormdata} secret={formdata} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
