import Service from 'components/Service'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import { omit } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSecretsQuery,
  useGetServiceQuery,
  useGetTeamK8SServicesQuery,
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
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateServiceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditServiceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteServiceMutation()
  const {
    data,
    isLoading: isLoadingService,
    isFetching: isFetchingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })
  const {
    data: k8sServices,
    isLoading: isLoadingK8sServices,
    isFetching: isFetchingK8sServices,
    isError: isErrorK8sServices,
    refetch: refetchK8sServices,
  } = useGetTeamK8SServicesQuery({ teamId })
  const {
    data: secrets,
    isLoading: isLoadingSecrets,
    isFetching: isFetchingSecrets,
    isError: isErrorSecrets,
    refetch: refetchSecrets,
  } = useGetSecretsQuery({ teamId })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingService) refetchService()
    if (!isFetchingSecrets) refetchSecrets()
    if (!isFetchingK8sServices) refetchK8sServices()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/services`} />
  const handleSubmit = (formData) => {
    if (serviceId) update({ teamId, serviceId, body: omit(formData, ['id', 'teamId']) as typeof formData })
    else create({ teamId, body: formData })
  }
  const handleDelete = (serviceId) => del({ teamId, serviceId })
  const loading = isLoadingService || isLoadingSecrets || isLoadingK8sServices
  const isError = isErrorService || isErrorSecrets
  const comp = !isError && (
    <Service
      teamId={teamId}
      service={data}
      k8sServices={k8sServices}
      secrets={secrets}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      mutating={mutating}
    />
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_SERVICE', { role: getRole(teamId) })} />
}
