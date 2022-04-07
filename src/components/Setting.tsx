import { getSettingSchema, getSettingUiSchema } from 'common/api-spec'
import { useSession } from 'providers/Session'
import React from 'react'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  settings: any
  settingId: string
}

export default function ({ onSubmit, settings: data, settingId }: Props): React.ReactElement {
  const { appsEnabled, settings, user, oboTeamId } = useSession()
  // END HOOKS
  const schema = getSettingSchema(appsEnabled, settings, settingId, data)
  const uiSchema = getSettingUiSchema(appsEnabled, settings, settingId, user, oboTeamId)
  return (
    <Form
      key={settingId}
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      onChange={onsubmit}
      data={data}
      resourceType='Setting'
      idProp={null}
      adminOnly
    />
  )
}
