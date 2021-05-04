import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import Form from './rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  settings: Settings
}

export default ({ onSubmit, settings }: Props): React.ReactElement => {
  // const [schema, setSchema] = useState()
  const [data, setData]: any = useState(settings)
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      title={<h1>Settings</h1>}
      key='updateSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      onSubmit={handleSubmit}
      formData={data}
    />
  )
}
