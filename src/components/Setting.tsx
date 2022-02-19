import React, { useEffect, useState } from 'react'
import { Box, Button } from '@mui/material'
import { isEmpty, isEqual } from 'lodash'
import { getSettingSchema, getSettingUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  settings: any
  settingId: string
}

export default ({ onSubmit, settings, settingId }: Props): React.ReactElement => {
  const [data, setData]: any = useState(settings[settingId])
  const [schema, setSchema] = useState({})
  const [uiSchema, setUiSchema] = useState()
  const { cluster, oboTeamId, user } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    const newSchema = getSettingSchema(settingId, cluster, formData)
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
  useEffect(() => {
    setData(settings[settingId])
    setSchema({})
  }, [settingId, settings])

  if (isEmpty(schema) || !uiSchema) {
    handleChange({ formData: data || {} })
    return null
  }

  return (
    <>
      <h1 data-cy='h1-edit-setting-page'>Settings</h1>
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
    </>
  )
}
