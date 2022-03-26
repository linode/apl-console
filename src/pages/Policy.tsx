/* eslint-disable @typescript-eslint/no-floating-promises */
import Policy from 'components/Policy'
import useAuthzSession from 'hooks/useAuthzSession'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { useEditSettingsMutation, useGetSettingsQuery } from 'store/otomi'

interface Params {
  policyId?: string
}

export default function ({
  match: {
    params: { policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [formData, setFormData] = useState()
  useEffect(() => {
    setFormData(undefined)
  }, [policyId])
  const { data: settings, isLoading, error } = useGetSettingsQuery({ ids: ['policies'] })
  const [editSettings] = useEditSettingsMutation()
  // END HOOKS
  if (formData) {
    editSettings({ body: { policies: { [policyId]: formData as any } } })
    setFormData(undefined)
  }
  let policies = settings?.policies
  if (formData) policies = { ...policies, [policyId]: formData }
  const comp = !(isLoading || error) && policies && (
    <Policy onSubmit={setFormData} policies={policies} policyId={policyId} />
  )
  return <PaperLayout comp={comp} loading={isLoading} />
}
