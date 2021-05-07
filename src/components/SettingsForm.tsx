import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import { Box, Button } from '@material-ui/core'
import Form from './rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'
import { useApi } from '../hooks/api'

interface Props {
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
  formData: Settings
}

export default ({ setFormData, formData }: Props): React.ReactElement => {
  const [state, setState] = useState(formData)

  return (
    <Form
      title={<h1>Settings</h1>}
      key='editSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      formData={state}
      onChange={(e) => setState(e.formData)}
      onSubmit={(e) => setFormData(e.formData)}
    />
  )
}
