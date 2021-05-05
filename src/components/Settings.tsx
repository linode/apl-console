import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import { ErrorSchema, IChangeEvent, ISubmitEvent } from '@rjsf/core'
import Form from './rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'
import { useApi } from '../hooks/api'

interface Props {
  formData: Settings
}

export default ({ formData }: Props): React.ReactElement => {
  const [state, setState] = useState(formData)
  return (
    <Form
      title={<h1>Settings</h1>}
      key='editSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      formData={state}
      onChange={(e) => setState(e.formData)}
      onSubmit={(e) => useApi('editSettings', true, e.formData)[0]}
    />
  )
}
