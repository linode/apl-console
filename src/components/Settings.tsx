import { Settings } from '@redkubes/otomi-api-client-axios'
import Form from '@rjsf/core'
import React, { useState } from 'react'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  settings: Settings
}

export default ({ onSubmit, settings }: Props): React.ReactElement => {
  // const [schema, setSchema] = useState()

  return <Form schema={getSettingsSchema()} />
}
