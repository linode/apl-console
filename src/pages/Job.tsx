import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Job from '../components/Job'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
  jobId?: string
}

export default ({
  match: {
    params: { teamId, jobId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { tid } = useAuthz(teamId)
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [job, jobLoading, jobError]: any = useApi('getJob', !!jobId, [tid, jobId])
  const [secrets, secretsLoading, secretsError]: any = useApi('getSecrets', true, [tid])
  const [createRes, createLoading, createError] = useApi(
    jobId ? 'editJob' : 'createJob',
    !!formdata,
    jobId ? [tid, jobId, omit(formdata, ['id', 'teamId'])] : [tid, formdata],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteJob', !!deleteId, [tid, jobId])
  if ((deleteRes && !(deleteLoading || deleteError)) || (createRes && !(createLoading || createError))) {
    return <Redirect to={`/teams/${tid}/jobs`} />
  }
  const loading = jobLoading || secretsLoading || createLoading || deleteLoading
  const err = jobError || secretsError || createError || deleteError
  const comp = !loading && (!err || formdata || job) && (
    <Job
      teamId={tid}
      // job={formdata || convertDataFromServer(job)}
      job={formdata || job}
      secrets={secrets}
      onSubmit={setFormdata}
      onDelete={setDeleteId}
    />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
