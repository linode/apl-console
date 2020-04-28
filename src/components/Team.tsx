import { Box, Button, Divider } from '@material-ui/core'
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

export default ({ onSubmit, onDelete = null, clusters, team = null }: Props): any => {
  const {
    user: { role },
  } = useSession()
  // / we need to set an empty dummy if no team was given, so that we can do a dirty check
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
  const uiSchema = getTeamUiSchema(schema, role)
  return (
    <div className='Team'>
      <h1>{data && data.name ? `Team: ${data.name}` : 'New Team'}</h1>

      <Form
        key='createTeam'
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        liveValidate={false}
        showErrorList={false}
      >
        <Box display='flex' flexDirection='row-reverse' m={1}>
          <Button variant='contained' color='primary' type='submit' disabled={!dirty || invalid}>
            Submit
          </Button>
          &nbsp;
          {team && team.teamId && <DeleteButton onDelete={onDelete} resourceName={team.name} resourceType='team' />}
        </Box>
      </Form>
    </div>
  )
}
