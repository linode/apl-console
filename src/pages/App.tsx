import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { renameKeys } from 'utils/data'
import App from 'components/App'
import useApi from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

interface Params {
  teamId: string
  appId: string
}

export default ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const [formData, setFormdata] = useState()

  const [app, appLoading, appError]: any = useApi('getApp', true, [teamId, appId])

  const [, editLoading, editError] = useApi('editApp', !!formData, [teamId, appId, renameKeys(formData)])

  const loading = appLoading || editLoading
  const err = appError || editError
  const comp = !loading && (!err || formData || app) && (
    <App onSubmit={setFormdata} {...(formData || app)} teamId={teamId} />
  )
  return <PaperLayout comp={comp} loading={loading} />
}
