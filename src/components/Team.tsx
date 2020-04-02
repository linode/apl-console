import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEqual } from 'lodash/lang'
import React, { useState } from 'react'
import { getSchema } from '../hooks/api'
import Team from '../models/Team'
import { useSession } from '../session-context'

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
    if (!error) {
      const { formData } = form
      const equal = isEqual(formData, team)
      setData(formData)
      setDirty(!equal)
    }
  }
  const handleSubmit = ({ schema, uiSchema, formData, edit, errors }): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  const uiSchema = schema.getTeamUiSchema(mySchema, role)

  return (
    <div className='Team'>
      <h2>Team details</h2>

      <Form
        key='createTeam'
        schema={mySchema}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onChange={handleChange}
        formData={data}
        liveValidate={false}
        showErrorList={false}
      >
        <Box display='flex' flexDirection='row-reverse' p={1} m={1}>
          {team.teamId && (
            <Button variant='contained' color='primary' startIcon={<DeleteIcon />} onClick={onDelete}>
              Delete
            </Button>
          )}
          <Button variant='contained' color='primary' type='submit' disabled={!dirty}>
            Submit
          </Button>
        </Box>
      </Form>
    </div>
  )
}
