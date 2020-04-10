import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
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
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'
  const [data, setData] = useState(team)
  const [dirty, setDirty] = useState(false)
  const handleChange = (form, error): any => {
    if (error) return
    const { formData } = form
    const equal = isEqual(formData, team)
    setData(formData)
    setDirty(!equal)
  }
  const handleSubmit = ({ formData }): any => {
    onSubmit(formData)
  }
  const schema = getTeamSchema(clusters)
  const uiSchema = getTeamUiSchema(schema, role)

  return (
    <div className='Team'>
      <h1>Team details</h1>

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
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          {team && team.teamId && (
            <Button variant='contained' color='primary' startIcon={<DeleteIcon />} onClick={onDelete}>
              Delete
            </Button>
          )}
          &nbsp;
          <Button variant='contained' color='primary' type='submit' disabled={!dirty}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
