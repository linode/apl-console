/* eslint-disable @typescript-eslint/no-floating-promises */
import Policy from 'components/Policy'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'

interface Params {
  policyId?: string
}

export default function ({
  match: {
    params: { policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { data: settings, refetch, isLoading } = useGetSettingsQuery({ ids: ['policies'] })
  const [edit, { isLoading: isLoadingUpdate }] = useEditSettingsMutation()
  const { t } = useTranslation()
  // END HOOKS
  const mutating = isLoadingUpdate
  const handleSubmit = (formData) => edit({ body: { policies: { [policyId]: formData } } }).then(refetch)
  const policies = settings?.policies
  const comp = <Policy onSubmit={handleSubmit} policies={policies} policyId={policyId} mutating={mutating} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_POLICY', { policyId })} />
}
