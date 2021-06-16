import React, { useEffect, useState } from 'react'
import { JSONSchema7 } from 'json-schema'
import { isEqual } from 'lodash'
import { Box, Button } from '@material-ui/core'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'
import { getSettingsSchema, getSettingsUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  setting: any
  settingId: string
}

export default ({ onSubmit, setting, settingId }: Props): React.ReactElement => {
  const [data, setData] = useState(setting)
  const [initialState, setInitialState] = useState(data)
  const [dirty, setDirty] = useState<boolean>(false)

  useEffect(() => {
    setData(setting)
    setInitialState(data)
  }, [data, setting])

  const handleChange = ({ formData }) => {
    setDirty(!isEqual(data, initialState))
    setData(formData)
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      key={settingId}
      id={settingId}
      schema={getSettingsSchema().properties[settingId]}
      uiSchema={getSettingsUiSchema()}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
      liveValidate={false}
      showErrorList={false}
      ObjectFieldTemplate={ObjectFieldTemplate}
    >
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          disabled={!dirty}
          data-cy={`button-submit-${settingId}`}
        >
          Submit
        </Button>
      </Box>
    </Form>
  )
}
