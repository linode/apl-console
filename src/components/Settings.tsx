import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import { ErrorSchema, IChangeEvent, ISubmitEvent } from '@rjsf/core'
import Form from './rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'

interface Props {
  formData: Settings
  onSubmit: (e: ISubmitEvent<any>) => any
}

export default ({ formData, onSubmit }: Props): React.ReactElement => {
  return (
    <Form
      title={<h1>Settings</h1>}
      key='editSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      formData={formData}
      onSubmit={onSubmit}
    />
  )
}
