import { Box, Button } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import DeleteButton from './DeleteButton'
import Team from '../models/Team'
import { useSession } from '../session-context'
import { getTeamSchema, getTeamUiSchema } from '../api-spec'

interface Props {
  onSubmit: CallableFunction
  onDelete?: any
  clusters: [string]
  team?: Team
}

export default ({ onSubmit, onDelete, clusters, team }: Props): any => {
  const {
    user: { role },
  } = useSession()
  // / we need to set an empty dummy if no team was given, so that we can do a dirty check
  const crudMethod = team && team.id ? 'update' : 'create'
  const [data, setData]: any = useState(team)
  const [dirty, setDirty] = useState(false)
  const [invalid, setInvalid] = useState(false)

  const handleChange = ({ formData: inData, errors }): any => {
    if (errors && errors.length) {
      setInvalid(true)
    } else {
      setInvalid(false)
    }
    const formData = { ...inData }
    setData(formData)
    setDirty(!isEqual(formData, team))
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }
  const schema = getTeamSchema(clusters)
  const uiSchema = getTeamUiSchema(schema, role, crudMethod)
  return (
    <div className='Team'>
      <h1 data-cy='h1-newteam-page'>{data && data.id ? `Team: ${data.id}` : 'New Team'}</h1>
      <Form
        key='createTeam'
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        liveValidate={false}
        showErrorList={false}
        idPrefix='form_el'
      >
        <Box display='flex' flexDirection='row-reverse' m={1}>
          <Button variant='contained' color='primary' type='submit' disabled={!dirty || invalid} data-cy='button-submit-team'>
            Submit
          </Button>
          &nbsp;
          {team && team.id && (
            <DeleteButton
              onDelete={() => onDelete(team.id)}
              resourceName={team.name}
              resourceType='team'
              data-cy='button-delete-team'
            />
          )}
        </Box>
      </Form>
    </div>
  )
}
