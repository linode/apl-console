import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import SettingsForm from '../components/SettingsForm'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [getFormData, getLoading, getErr] = useApi('getSettings')
  const [formData, setFormData] = useState()

  const [editRes, editLoading, editErr] = useApi('editSettings', !!formData, [formData])

  const err = getErr || editErr
  const loading = getLoading || editLoading

  return (
    <PaperLayout
      err={err}
      loading={loading}
      comp={!(err || loading) && <SettingsForm setFormData={setFormData} formData={getFormData} />}
    />
  )
}
