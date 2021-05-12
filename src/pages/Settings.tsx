import React, { useState } from 'react'
import { values } from 'lodash'
import PaperLayout from '../layouts/Paper'
import SettingsConsoleList from '../components/SettingsConsoleList'
import SettingsAccordion from '../components/SettingsAccordion'
import { useApi } from '../hooks/api'
import { getSettingsSchema } from '../api-spec'

export default (): React.ReactElement => {
  const [getFormData, getLoading] = useApi('getSettings')
  // eslint-disable-next-line prefer-const
  let [formData, setFormData] = useState()
  formData = formData ? Object.assign(formData, getFormData) : formData

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
              return (
                <SettingsAccordion
                  header={val}
                  formData={getFormData[val]}
                  setFormData={setFormData}
                  schema={getSettingsSchema(val)}
                />
              )
            })}
          </>
        )
      }
    />
  )
}
