import { Box, Button } from '@mui/material'
import isEqual from 'lodash/isEqual'
import React, { useState } from 'react'
import { Job, Secret } from '@redkubes/otomi-api-client-axios'
import { cloneDeep } from 'lodash'
import { getJobSchema, getJobUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import Form from './rjsf/Form'
import DeleteButton from './DeleteButton'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  job?: Job
  secrets: Secret[]
  teamId: string
}

export default ({ onSubmit, onDelete, job, secrets, teamId }: Props): React.ReactElement => {
  const { user, cluster, dns, oboTeamId } = useSession()
  const [schema, setSchema] = useState()
  const [uiSchema, setUiSchema] = useState()
  const [data, setData]: any = useState(job)
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData: inData }) => {
    const formData = cloneDeep(inData)
    const newSchema = getJobSchema(cluster, dns, formData, secrets)
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
        <Button variant='contained' color='primary' type='submit' disabled={!dirty} data-cy='button-submit-job'>
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
