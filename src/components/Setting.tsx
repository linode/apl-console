import { getSettingSchema, getSettingUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  settings: any
  settingId: string
}

export default function ({ onSubmit, settings: formSettings, settingId }: Props): React.ReactElement {
  const { appsEnabled, settings, user, oboTeamId } = useSession()
  const [data, setData]: any = useState(formSettings[settingId])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getSettingSchema(appsEnabled, settings, settingId, formData)
  const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId, user, oboTeamId)
  return (
    <Form
      key={settingId}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      setData={setData}
      data={formData}
      resourceName={settingId}
      resourceType='Setting'
      idProp={undefined}
      adminOnly
    />
  )
}
