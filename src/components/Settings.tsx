import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import Form from './rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'

interface Props {
  someProp: number
}

export default ({ someProp }: Props): React.ReactElement => {
  return (
    <Form
      title={<h1>Settings</h1>}
      key='updateSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
    />
  )
}
