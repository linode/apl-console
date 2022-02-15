import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Service from 'components/Service'
import { useApi, useAuthz } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  teamId?: string
  serviceId?: string
}

export default ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { tid } = useAuthz(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [service, serviceLoading, serviceError]: any = useApi('getService', !!serviceId, [tid, serviceId])
  const [secrets, secretsLoading, secretsError]: any = useApi('getSecrets', true, [tid])
  const [createRes, createLoading, createError] = useApi(
    serviceId ? 'editService' : 'createService',
    !!formData,
    serviceId ? [tid, serviceId, omit(formData, ['id', 'teamId'])] : [tid, formData],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteService', !!deleteId, [tid, serviceId])
  if ((deleteRes && !(deleteLoading || deleteError)) || (createRes && !(createLoading || createError))) {
    return <Redirect to={`/teams/${tid}/services`} />
  }
  const loading = serviceLoading || secretsLoading || createLoading || deleteLoading
  const err = serviceError || secretsError || createError || deleteError
  const comp = !loading && (!err || formData || service) && (
    <Service
      teamId={tid}
      // service={formData || convertDataFromServer(service)}
      service={formData || service}
      secrets={secrets}
      onSubmit={setFormData}
      onDelete={setDeleteId}
    />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
