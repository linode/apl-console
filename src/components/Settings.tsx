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
  const [send, setSend] = useState(false)
  const [updateRes, updateLoading, updateError] = useApi('editSettings', send, [state])

  return (
    <Form
      title={<h1>Settings</h1>}
      key='editSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      formData={state}
      onChange={(e) => setState(e.formData)}
      onSubmit={(e) => setSend(true)}
    />
  )
}
