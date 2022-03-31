import { Box, Button } from '@mui/material'
import { getSettingSchema, getSettingUiSchema } from 'common/api-spec'
import { isEmpty, isEqual } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  settings: any
  settingId: string
}

export default function ({ onSubmit, settings: formSettings, settingId }: Props): React.ReactElement {
  const [data, setData]: any = useState(formSettings[settingId])
  const [schema, setSchema] = useState({})
  const [uiSchema, setUiSchema] = useState()
  const { appsEnabled, settings, oboTeamId, user } = useSession()
  const [isDirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    const newSchema = getSettingSchema(appsEnabled, settings, settingId, formData)
    setSchema(newSchema)
    const newUiSchema = getSettingUiSchema(appsEnabled, settings, settingId, user, oboTeamId)
    setUiSchema(newUiSchema)
    setData(formData)
    const isDirty = !isEqual(formData, formSettings[settingId])
    setDirty(isDirty)
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
    setDirty(false)
  }
  useEffect(() => {
    setData(formSettings[settingId])
    setSchema({})
  }, [settingId, formSettings])

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
          <Button type='submit' disabled={!isDirty} data-cy={`button-submit-${settingId}`}>
            Submit
          </Button>
        </Box>
      </Form>
    </>
  )
}
