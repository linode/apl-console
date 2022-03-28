import { Box, Button } from '@mui/material'
import { getJobSchema, getJobUiSchema } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import isEqual from 'lodash/isEqual'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetJobApiResponse, GetSecretsApiResponse } from 'redux/otomiApi'
import DeleteButton from './DeleteButton'
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
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const [data, setData]: any = useState(job)
  const [isDirty, setDirty] = useState(false)
  const handleChange = ({ formData: inData }) => {
    const formData = cloneDeep(inData)
    const newSchema = getJobSchema(settings, formData, secrets)
    setSchema(newSchema)
    setUiSchema(getJobUiSchema(formData, user, oboTeamId))
    setData(formData)
    setDirty(!isEqual(formData, job))
  }
  if (!(schema || uiSchema)) {
    handleChange({ formData: job || {} })
    return null
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      title={
        <h1 data-cy={data && data.jobId ? `h1-edit-job-page` : 'h1-newjob-page'}>
          {data && data.id ? `Job: ${data.name}` : 'New Job'}
          {user.isAdmin && teamId ? ` (team ${teamId})` : ''}
        </h1>
      }
      key='createJob'
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
    >
      <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
        <Button variant='contained' color='primary' type='submit' disabled={!isDirty} data-cy='button-submit-job'>
          Submit
        </Button>
        &nbsp;
        {data && data.id && (
          <DeleteButton
            onDelete={() => onDelete(data.id)}
            resourceName={data.name}
            resourceType='job'
            dataCy='button-delete-job'
          />
        )}
      </Box>
    </Form>
  )
}
