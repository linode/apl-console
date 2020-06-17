import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Secrets from '../components/Secrets'
import Error from '../components/Error'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): any => {
  const {
    oboTeamId,
    user: { isAdmin, teamId: userTeamId },
  } = useSession()
  const sessTeamId = isAdmin ? oboTeamId : userTeamId
  const [secrets, loading, error]: any = useApi('getSecrets', true, { teamId })
  const [deleteId, setDeleteId]: any = useState()
  const [deleteRes, deleteLoading, deleteErr] = useApi(
    'deleteSecret',
    !!deleteId,
    { secretId: deleteId, teamId: sessTeamId },
    null,
  )
  if (!deleteLoading && (deleteRes || deleteErr)) {
    // @rtodo: fix this ugly hack, but how?
    window.location.reload()
  }

  return (
    <PaperLayout>
      {loading && <Loader />}
      {secrets && <Secrets secrets={secrets} setDeleteId={setDeleteId} />}
      {(error || deleteErr) && <Error code={404} />}
    </PaperLayout>
  )
}
