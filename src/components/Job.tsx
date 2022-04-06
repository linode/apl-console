import { getJobSchema, getJobUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetJobApiResponse, GetSecretsApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  job?: GetJobApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

export default function ({ onSubmit, onDelete, job, secrets, teamId }: Props): React.ReactElement {
  const { user, oboTeamId, settings } = useSession()
  const [data, setData]: any = useState(job)
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getJobSchema(settings, data, secrets)
  const uiSchema = getJobUiSchema(data, user, oboTeamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      onDelete={onDelete}
      onChange={setData}
      data={formData}
      resourceName={job?.name}
      resourceType='Job'
    />
  )
}
