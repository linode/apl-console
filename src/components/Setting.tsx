import React, { useState } from 'react'
import { JSONSchema7 } from 'json-schema'
import { isEqual } from 'lodash'
import { Box, Button } from '@material-ui/core'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  onSubmit: CallableFunction
  setting: any
  settingId: string
  schema: JSONSchema7
}

export default ({ onSubmit, setting, settingId, schema }: Props): React.ReactElement => {
  const [data, setData]: any = useState(setting)
  const [dirty, setDirty] = useState(false)

  const handleChange = ({ formData }) => {
    setData(formData)
    setDirty(!isEqual(formData, setting))
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      schema={schema}
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
          data-cy={`button-submit-${setting}`}
        >
          Submit
        </Button>
      </Box>
    </Form>
  )
}
