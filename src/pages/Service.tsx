import Service from 'components/Service'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSecretsQuery,
  useGetServiceQuery,
} from 'redux/otomiApi'
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
  const [create] = useCreateServiceMutation()
  const [update] = useEditServiceMutation()
  const [del] = useDeleteServiceMutation()
  const { data, isLoading } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })
  const { data: secrets, isLoading: isLoadingSecrets } = useGetSecretsQuery({ teamId })
  const { t } = useTranslation()
  // END HOOKS
  const handleSubmit = (formData) => {
    if (serviceId) update({ teamId, serviceId, body: omit(formData, ['id', 'teamId']) as typeof formData })
    else create({ teamId, body: formData })
  }
  const handleDelete = (serviceId) => del({ teamId, serviceId })
  const loading = isLoading || isLoadingSecrets
  const comp = (
    <Service teamId={teamId} service={data} secrets={secrets} onSubmit={handleSubmit} onDelete={handleDelete} />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICE', { role: getRole(teamId) })} />
}
