import React from 'react'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [getFormData, getLoading, getErr] = useApi('getSettings')

  return (
    <PaperLayout
      err={getErr}
      loading={getLoading}
      comp={!(getErr || getLoading) && <Settings formData={getFormData} />}
    />
  )
}
