/* eslint-disable @typescript-eslint/no-floating-promises */
import Policy from 'components/Policy'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useAppSelector } from 'redux/hooks'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'

interface Params {
  policyId?: string
}

export default function ({
  match: {
    params: { policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const settingId = 'policies'
  const { data: settings, isLoading, isFetching, isError, refetch } = useGetSettingsQuery({ ids: [settingId] })
  const [edit, { isLoading: isLoadingUpdate }] = useEditSettingsMutation()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  const handleSubmit = (formData) => edit({ settingId, body: { policies: { [policyId]: formData } } }).then(refetch)
  const policies = settings?.policies
  const comp = !isError && (
    <Policy onSubmit={handleSubmit} policies={policies} policyId={policyId} mutating={mutating} />
  )
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_POLICY', { policyId })} />
}
