import { Box, Button } from '@mui/material'
import { getTeamSchema, getTeamUiSchema } from 'common/api-spec'
import { isEqual } from 'lodash/lang'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetTeamApiResponse } from 'redux/otomiApi'
import DeleteButton from './DeleteButton'
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
  const [isDirty, setDirty] = useState(false)

  const schema = getTeamSchema(appsEnabled, settings, data)
  const uiSchema = getTeamUiSchema(appsEnabled, settings, user, oboTeamId, crudMethod)

  const handleChange = ({ formData }) => {
    setData(formData)
    setDirty(!isEqual(formData, team))
  }
  const handleSubmit = ({ formData }) => {
    onSubmit(formData)
  }
  return (
    <Form
      title={<h1 data-cy='h1-newteam-page'>{data && data.id ? `Team: ${data.id}` : 'New Team'}</h1>}
      key='createTeam'
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      formData={data}
    >
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button type='submit' disabled={!isDirty} data-cy='button-submit-team'>
          Submit
        </Button>
        &nbsp;
        {team && team.id && (
          <DeleteButton
            onDelete={() => onDelete(team.id)}
            resourceName={team.name}
            resourceType='team'
            dataCy='button-delete-team'
          />
        )}
      </Box>
    </Form>
  )
}
