import { getTeamSchema, getTeamUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetTeamApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  team?: GetTeamApiResponse
}

export default function ({ onSubmit, onDelete, team }: Props): React.ReactElement {
  const { appsEnabled, settings, user, oboTeamId } = useSession()
  // / we need to set an empty dummy if no team was given, so that we can do a isDirty check
  const crudMethod = team && team.id ? 'update' : 'create'
  const [data, setData]: any = useState(team)
  const formData = cloneDeep(data)
  const schema = getTeamSchema(appsEnabled, settings, formData)
  const uiSchema = getTeamUiSchema(appsEnabled, settings, user, oboTeamId, crudMethod)
  return (
    <Form
      adminOnly
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      onChange={setData}
      data={formData}
      resourceName={team?.name}
      resourceType='Team'
    />
  )
}
