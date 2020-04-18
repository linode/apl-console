import { Box, Button } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import Form from '@rjsf/material-ui'
import { isEmpty, isEqual } from 'lodash/lang'
import { pick } from 'lodash'
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
  const {
    user: { role },
  } = useSession()
  // / we need to set an empty dummy if no team was given, so that we can do a dirty check
  const newTeam = { name: undefined, azure: { monitor: {} }, clusters: [] }
  const [data, setData]: any = useState(team || newTeam)
  const [dirty, setDirty] = useState(false)
  const handleChange = (form, error): any => {
    if (error) return
    const { formData } = form
    if (!data) {
      setData(formData)
      return
    }
    setData(formData)
    setDirty(!isEqual(formData, team || newTeam))
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
