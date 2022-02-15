import { Box, Button } from '@mui/material'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { Team } from '@redkubes/otomi-api-client-axios'
import { getTeamSchema, getTeamUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import DeleteButton from './DeleteButton'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  team?: Team
}

export default ({ onSubmit, onDelete, team }: Props): React.ReactElement => {
  const { cluster, user, oboTeamId } = useSession()
  // / we need to set an empty dummy if no team was given, so that we can do a dirty check
  const crudMethod = team && team.id ? 'update' : 'create'

  const [data, setData]: any = useState(team)
  const [dirty, setDirty] = useState(false)

  const schema = getTeamSchema(data, cluster)
  const uiSchema = getTeamUiSchema(user, oboTeamId, crudMethod)

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
        <Button variant='contained' color='primary' type='submit' disabled={!dirty} data-cy='button-submit-team'>
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
