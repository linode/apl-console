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
  const { data: settings, refetch, isLoading, error } = useGetSettingsQuery({ ids: ['policies'] })
  const [editSettings] = useEditSettingsMutation()
  const { t } = useTranslation()
  // END HOOKS
  const handleSubmit = (formData) => editSettings({ body: { policies: { [policyId]: formData } } }).then(refetch)
  const policies = settings?.policies
  const comp = <Policy onSubmit={handleSubmit} policies={policies} policyId={policyId} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_POLICY', { policyId })} />
}
