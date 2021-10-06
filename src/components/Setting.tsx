import React, { useEffect, useState } from 'react'
import { Box, Button } from '@material-ui/core'
import { isEqual } from 'lodash'
import Form from './rjsf/Form'
import { getSettingSchema, getSettingUiSchema } from '../api-spec'
import { useSession } from '../session-context'

interface Props {
  onSubmit: CallableFunction
  setting: any
  settingId: string
}

export default ({ onSubmit, setting, settingId }: Props): React.ReactElement => {
  const [data, setData]: any = useState(setting)
  useEffect(() => {
    setData(setting)
  }, [setting])
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const { cluster, oboTeamId, user } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    setSchema(getSettingSchema(settingId, cluster))
    setUiSchema(getSettingUiSchema(settingId, user, oboTeamId))
    setData(formData)
    const isDirty = !isEqual(formData, setting || {})
    setDirty(isDirty)
  }
  if (!(schema || uiSchema)) {
    handleChange({ formData: setting || {} })
    return null
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      key={settingId}
      id={settingId}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
      hideHelp
    >
      <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
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
