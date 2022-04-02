import Service from 'components/Service'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSecretsQuery,
  useGetServiceQuery,
} from 'redux/otomiApi'
import { k } from 'translations/keys'
import { getRole } from 'utils/data'

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
  const [create, { isLoading: isLoadingCreate, isSuccess: okCreate, status: statusCreate }] = useCreateServiceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: okUpdate, status: statusUpdate }] = useEditServiceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: okDelete, status: statusDelete }] = useDeleteServiceMutation()
  const { data, isLoading, error } = useGetServiceQuery(
    { teamId, serviceId },
    { skip: !serviceId || isLoadingCreate || isLoadingUpdate || isLoadingDelete || okCreate || okUpdate || okDelete },
  )
  const { data: secrets, isLoading: isLoadingSecrets, error: errorSecrets } = useGetSecretsQuery({ teamId })
  useEffect(() => {
    if (formData) {
      setFormData(undefined)
      if (serviceId) update({ teamId, serviceId, body: omit(formData, ['id', 'teamId']) as typeof formData })
      else create({ teamId, body: formData })
    }
    if (deleteId) {
      setDeleteId()
      del({ teamId, serviceId })
    }
  }, [formData, deleteId])
  const { t } = useTranslation()
  // END HOOKS
  if (okDelete || okCreate || okUpdate) return <Redirect to={`/teams/${teamId}/services`} />
  const loading = isLoading || isLoadingSecrets
  const err = error || errorSecrets
  const service = formData || data
  const comp = !(loading || err) && (
    <Service teamId={teamId} service={service} secrets={secrets} onSubmit={setFormData} onDelete={setDeleteId} />
  )
  return <PaperLayout loading={loading} comp={comp} title={t(k.TITLE_SERVICE, { role: getRole(teamId) })} />
}
