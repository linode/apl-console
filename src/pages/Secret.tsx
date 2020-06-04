import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Loader from '../components/Loader'
import Secret from '../components/Secret'
import SecretModel from '../models/Secret'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import Error from '../components/Error'

interface SubmitProps {
  teamId: string
  secretId?: string
  data: SecretModel
}

const Submit = ({ teamId, data }: SubmitProps): any => {
  const [result] = useApi('createSecret', { teamId }, data)
  if (result) {
    return <Redirect to={`/teams/${teamId}/secrets`} />
  }
  return null
}

interface DeleteProps {
  teamId: string
  secretId: string
}

const Delete = ({ teamId, secretId }: DeleteProps): any => {
  const [result] = useApi('deleteSecret', { secretId }, null)
  if (result) {
    return <Redirect to={`/teams/${teamId}/secrets`} />
  }
  return null
}

interface EditProps {
  teamId: string
  secretId: string
  team: any
  clusters: any
  onSubmit: CallableFunction
  onDelete: CallableFunction
}

const EditSecret = ({ teamId, secretId, team, clusters, onSubmit, onDelete }: EditProps): any => {
  const [secret, secretLoading, error]: any = useApi('getSecret', {
    teamId,
    secretId,
  })

  if (secretLoading) {
    return <Loader />
  }
  if (error) {
    return <Error code={error.response.status} msg={error.response.statusText} />
  }
  return <Secret team={team} secret={secret} clusters={clusters} onSubmit={onSubmit} onDelete={onDelete} />
}

interface Params {
  teamId?: string
  secretId?: string
}

export default ({
  match: {
    params: { teamId, secretId },
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
  const [team, loading, error]: [any, boolean, any] = useApi('getTeam', tid)
  if (error) {
    return <Error code={error.response.status} msg={`Team Loading Error: ${error.response.statusText}`} />
  }
  const [formdata, setFormdata] = useState()
  const [deleteSecret, setDeleteSecret] = useState()

  return (
    <PaperLayout>
      {err || (
        <>
          {loading && <Loader />}
          {team && formdata && <Secret team={team} clusters={clusters} onSubmit={setFormdata} secret={formdata} />}
          {team && secretId && !formdata && (
            <EditSecret
              teamId={tid}
              secretId={secretId}
              team={team}
              clusters={clusters}
              onSubmit={setFormdata}
              onDelete={setDeleteSecret}
            />
          )}
          {team && secretId && !formdata && deleteSecret && <Delete teamId={tid} secretId={secretId} />}
          {team && !secretId && !formdata && (
            <Secret team={team} secret={formdata} clusters={clusters} onSubmit={setFormdata} />
          )}
          {formdata && <Submit teamId={tid} secretId={secretId} data={formdata} />}
        </>
      )}
    </PaperLayout>
  )
}
