import React, { useEffect, useState } from 'react'
import { Settings } from '@redkubes/otomi-api-client-axios'
import { RouteComponentProps } from 'react-router-dom'
import { ApiError } from 'utils/error'
import { renameKeys } from 'utils/data'
import Policy from 'components/Policy'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  policyId?: string
}

export default ({
  match: {
    params: { policyId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const [formData, setFormdata] = useState()

  useEffect(() => {
    setFormdata(undefined)
  }, [policyId])

  const [settings, settingsLoading, settingsError]: [Settings, boolean, ApiError] = useApi('getSetting', !!policyId, [
    'policies',
  ])

  const [, editLoading, editError] = useApi('editSetting', !!formData, [
    'policies',
    { policies: renameKeys({ [policyId]: formData }) },
  ])

  const loading = settingsLoading || editLoading
  const err = settingsError || editError
  let formSettings = settings?.policies
  if (formData) formSettings = { ...formSettings, [policyId]: formData }
  const comp = !loading && (!err || formData || settings) && (
    <Policy onSubmit={setFormdata} policies={formSettings} policyId={policyId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
