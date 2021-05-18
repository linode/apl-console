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

  const [editRes, editLoading] = useApi('editSettings', !isEqual(settings, formData), [formData])
  const loading = getLoading || editLoading

  return (
    <PaperLayout
      loading={loading}
      comp={
        !loading && (
          <>
            <SettingsConsoleList />
            {Object.keys(settings).map((val) => {
              const [subSettings, setSubSettings] = useState()
              if (subSettings) setFormData({ ...settings, [val]: subSettings })
              return (
                <SettingsAccordion
                  header={val}
                  settings={settings[val]}
                  onSubmit={setSubSettings}
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
