/* eslint-disable @typescript-eslint/no-floating-promises */
import Netpol from 'components/Netpol'
import PaperLayout from 'layouts/Paper'
import { omit, unset } from 'lodash'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import {
  useCreateNetpolMutation,
  useDeleteNetpolMutation,
  useEditNetpolMutation,
  useGetNetpolQuery,
} from 'redux/otomiApi'

interface Params {
  teamId: string
  netpolName?: string
}

export default function ({
  match: {
    params: { teamId, netpolName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateNetpolMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditNetpolMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteNetpolMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetNetpolQuery(
    { teamId, netpolName },
    { skip: !netpolName },
  )
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/netpols`} />
  const handleSubmit = (formData) => {
    const type = formData.ruleType.type
    const mode = formData?.ruleType?.ingress?.mode
    if (mode === 'AllowAll' && type === 'ingress') unset(formData, 'ruleType.ingress.allow')
    if (type === 'ingress') unset(formData, 'ruleType.egress')
    else unset(formData, 'ruleType.ingress')
    if (netpolName) update({ teamId, netpolName, body: omit(formData, ['id', 'teamId']) as any })
    else create({ teamId, body: formData })
  }
  const handleDelete = () => del({ teamId, netpolName })
  const comp = !isError && (
    <Netpol onSubmit={handleSubmit} netpol={data} onDelete={handleDelete} teamId={teamId} mutating={mutating} />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_NETPOL', { netpolName, role: 'team' })} />
}
