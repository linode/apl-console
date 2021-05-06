import React from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [getFormData, getLoading, getErr] = useApi('getSettings')

  const err = getErr
  const loading = getLoading

  return <PaperLayout err={err} loading={loading} comp={!(err || loading) && <Settings formData={getFormData} />} />
}
