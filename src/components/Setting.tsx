import React, { useEffect, useState } from 'react'
import { Box, Button } from '@material-ui/core'
import { isEqual } from 'lodash'
import Form from './rjsf/Form'
import { getSettingSchema, getSettingUiSchema } from '../api-spec'
import { useSession } from '../session-context'

interface Props {
  onSubmit: CallableFunction
  settings: any
  settingId: string
}

export default ({ onSubmit, settings, settingId }: Props): React.ReactElement => {
  const [data, setData]: any = useState(settings[settingId])
  useEffect(() => {
    setData(settings[settingId])
  }, [settingId, settings])
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const { cluster, oboTeamId, user } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    const newSchema = getSettingSchema(settingId, cluster, formData, settings)
    setSchema(newSchema)
    const newUiSchema = getSettingUiSchema(settingId, user, oboTeamId)
    setUiSchema(newUiSchema)
    setData(formData)
    const isDirty = !isEqual(formData, settings[settingId] || {})
    setDirty(isDirty)
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
    setDirty(false)
  }
  if (!(schema || uiSchema)) {
    handleChange({ formData: data || {} })
    return null
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
