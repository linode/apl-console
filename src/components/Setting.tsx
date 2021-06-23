import React, { useEffect, useState } from 'react'
import { Box, Button, makeStyles } from '@material-ui/core'
import { isEqual } from 'lodash'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'
import { getSettingSchema, getSettingUiSchema } from '../api-spec'
import { useSession } from '../session-context'

const useStyles = makeStyles((theme) => ({
  alwaysBottom: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))
interface Props {
  onSubmit: CallableFunction
  setting: any
  settingId: string
}

export default ({ onSubmit, setting, settingId }: Props): React.ReactElement => {
  const classes = useStyles()
  const [data, setData]: any = useState(setting)
  useEffect(() => {
    setData(setting)
  }, [setting])
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const { cluster } = useSession()
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    setSchema(getSettingSchema(settingId, cluster))
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
      <Box className={classes.alwaysBottom} display='flex' flexDirection='row-reverse' m={1}>
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
