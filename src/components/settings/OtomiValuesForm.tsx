import { Settings } from '@redkubes/otomi-api-client-axios'
import React, { useState } from 'react'
import { Box, Button } from '@material-ui/core'
import Form from '../rjsf/Form'
import { getSettingsSchema, getSettingsUiSchema } from '../../api-spec'

interface Props {
  formData: Settings
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
}

export default ({ formData, setFormData }: Props): React.ReactElement => {
  const [state, setState] = useState(formData)

  return (
    <Form
      title={<h1>Otomi Settings</h1>}
      key='editSettings'
      schema={getSettingsSchema()}
      uiSchema={getSettingsUiSchema()}
      formData={state}
      onChange={(e) => setState(e.formData)}
      onSubmit={(e) => setFormData(e.formData)}
    >
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button variant='contained' color='primary' type='submit' data-cy='button-submit-team'>
          Submit
        </Button>
      </Box>
    </Form>
  )
}
