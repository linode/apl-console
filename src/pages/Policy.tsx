import { Settings } from '@redkubes/otomi-api-client-axios'
import Policy from 'components/Policy'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { renameKeys } from 'utils/data'
import { ApiError } from 'utils/error'

interface Params {
  policyId?: string
}

export default function ({
  match: {
    params: { policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [formData, setFormdata] = useState()

  useEffect(() => {
    setFormdata(undefined)
  }, [policyId])

  const [settings, settingsLoading, settingsError]: [Settings, boolean, ApiError] = useApi('getSettings', !!policyId, [
    ['policies'],
  ])

  const [, editLoading, editError] = useApi('editSettings', !!formData, [
    { policies: renameKeys({ [policyId]: formData }) },
  ])

  const loading = settingsLoading || editLoading
  const err = settingsError || editError
  let formSettings = settings?.policies
  if (formData) formSettings = { ...formSettings, [policyId]: formData }
  const comp = !loading && (!err || formData || settings?.policies) && (
    <Policy onSubmit={setFormdata} policies={formSettings} policyId={policyId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
