import React, { useState } from 'react'
import { isEqual, values } from 'lodash'
import PaperLayout from '../layouts/Paper'
import SettingsConsoleList from '../components/SettingsConsoleList'
import SettingsAccordion from '../components/SettingsAccordion'
import { useApi } from '../hooks/api'
import { getSettingsSchema } from '../api-spec'

export default (): React.ReactElement => {
  const [settings, getLoading] = useApi('getSettings')
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
            {Object.keys(settings).map((header) => {
              return (
                <SettingsAccordion
                  header={header}
                  settings={settings}
                  onSubmit={setFormData}
                  schema={getSettingsSchema(header)}
                />
              )
            })}
          </>
        )
      }
    />
  )
}
