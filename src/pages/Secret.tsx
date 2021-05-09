import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Secret from '../components/Secret'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
  secretId: string
}

export default ({
  match: {
    params: { teamId, secretId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { tid } = useAuthz(teamId)
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [secret, secretLoading, secretError]: any = useApi('getSecret', !!secretId, [tid, secretId])
  const [createRes, createLoading, createError] = useApi(
    secretId ? 'editSecret' : 'createSecret',
    !!formdata,
    secretId ? [tid, secretId, formdata] : [tid, formdata],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteSecret', !!deleteId, [tid, secretId])
  if ((deleteRes && !(deleteLoading || deleteError)) || (createRes && !(createLoading || createError))) {
    return <Redirect to={`/teams/${tid}/secrets`} />
  }
  const loading = secretLoading || createLoading || deleteLoading
  const err = secretError || createError || deleteError
  if (createRes && !(createLoading || createError)) {
    return <Redirect to={`/teams/${tid}/secrets`} />
  }
  const comp = !(err || loading) && <Secret onSubmit={setFormdata} secret={formdata || secret} onDelete={setDeleteId} />
  return <PaperLayout err={err} loading={loading} comp={comp} />
}
