import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import Console from '../components/settings/Console'
import Otomi from '../components/settings/Otomi'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [getFormData, getLoading, getErr] = useApi('getSettings')
  const [formData, setFormData] = useState()

  const [editRes, editLoading, editErr] = useApi('editSettings', !!formData, [formData])

  const loading = getLoading || editLoading

  return (
    <PaperLayout
      loading={loading}
      comp={
        !loading && (
          <>
            <Console />
            <Otomi setFormData={setFormData} formData={getFormData} />
          </>
        )
      }
    />
  )
}
