import React, { useEffect, useState } from 'react'
import { Box, Button } from '@material-ui/core'
import { isEqual } from 'lodash'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'
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
  const { cluster } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    setSchema(getSettingSchema(settingId, cluster, formData))
    setUiSchema(getSettingUiSchema())
    setData(formData)
    setDirty(!isEqual(formData, setting))
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
      liveValidate={false}
      showErrorList={false}
      ObjectFieldTemplate={ObjectFieldTemplate}
    >
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button
          variant='contained'
          color='primary'
          type='submit'
          // TODO: dirty. It's hard to fix:
          // The `setting` parameter does not include the default values from the formData,
          // hence they are never equal like in e.g. the Team.tsx component.
          //  There is not enough time to finish it now.
          disabled={!dirty}
          data-cy={`button-submit-${settingId}`}
        >
          Submit
        </Button>
      </Box>
    </Form>
  )
}
