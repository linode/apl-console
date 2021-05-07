import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import ConsoleForm from '../components/settings/ConsoleForm'
import OtomiValuesForm from '../components/settings/OtomiValuesForm'
import { useApi } from '../hooks/api'

export default (): React.ReactElement => {
  const [getFormData, getLoading] = useApi('getSettings')
  const [formData, setFormData] = useState()

  const [editRes, editLoading] = useApi('editSettings', !!formData, [formData])

  const loading = getLoading || editLoading

  return (
    <PaperLayout
      loading={loading}
      comp={
        !loading && (
          <>
            <ConsoleForm />
            <OtomiValuesForm setFormData={setFormData} formData={getFormData} />
          </>
        )
      }
    />
  )
}
