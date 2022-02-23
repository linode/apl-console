import Job from 'components/Job'
import useApi, { useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

interface Params {
  teamId?: string
  jobId?: string
}

export default function ({
  match: {
    params: { teamId, jobId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { tid } = useAuthz(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [job, jobLoading, jobError]: any = useApi('getJob', !!jobId, [tid, jobId])
  const [secrets, secretsLoading, secretsError]: any = useApi('getSecrets', true, [tid])
  const [createRes, createLoading, createError] = useApi(
    jobId ? 'editJob' : 'createJob',
    !!formData,
    jobId ? [tid, jobId, omit(formData, ['id', 'teamId'])] : [tid, formData],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteJob', !!deleteId, [tid, jobId])
  if ((deleteRes && !(deleteLoading || deleteError)) || (createRes && !(createLoading || createError))) {
    return <Redirect to={`/teams/${tid}/jobs`} />
  }
  const loading = jobLoading || secretsLoading || createLoading || deleteLoading
  const err = jobError || secretsError || createError || deleteError
  const comp = !loading && (!err || formData || job) && (
    <Job
      teamId={tid}
      // job={formData || convertDataFromServer(job)}
      job={formData || job}
      secrets={secrets}
      onSubmit={setFormData}
      onDelete={setDeleteId}
    />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
