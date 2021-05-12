import React, { useState } from 'react'
import PaperLayout from '../layouts/Paper'
import SettingsConsoleList from '../components/SettingsConsoleList'
import SettingsAccordion from '../components/SettingsAccordion'
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
            <SettingsConsoleList />
            {Object.keys(getFormData).map((val) => {
              return <SettingsAccordion header={val} formData={getFormData[val]} setFormData={setFormData} />
            })}
          </>
        )
      }
    />
  )
}
