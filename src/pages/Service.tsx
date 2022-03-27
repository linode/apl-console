import Service from 'components/Service'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSecretsQuery,
  useGetServiceQuery,
} from 'store/otomi'

interface Params {
  teamId: string
  serviceId?: string
}

export default function ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  useAuthzSession(teamId)
  const [formData, setFormData] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [create, { isSuccess: okCreate }] = useCreateServiceMutation()
  const [update, { isSuccess: okUpdate }] = useEditServiceMutation()
  const [del, { isSuccess: okDelete }] = useDeleteServiceMutation()
  const { data, isLoading, error } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })
  const { data: secrets, isLoading: isLoadingSecrets, error: errorSecrets } = useGetSecretsQuery({ teamId })
  // END HOOKS
  if (formData) {
    if (serviceId) update({ teamId, serviceId, body: omit(formData, ['id', 'teamId']) as typeof formData })
    else create({ teamId, body: formData })
    setFormData(undefined)
  }
  if (deleteId) {
    del({ teamId, serviceId })
    setDeleteId()
  }
  if (okDelete || okCreate || okUpdate) return <Redirect to={`/teams/${teamId}/services`} />
  const loading = isLoading || isLoadingSecrets
  const err = error || errorSecrets
  const service = formData || data
  const comp = !(loading || err) && (
    <Service teamId={teamId} service={service} secrets={secrets} onSubmit={setFormData} onDelete={setDeleteId} />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
