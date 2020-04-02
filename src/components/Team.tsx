import { Button } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import React from 'react'
import { getSchema } from '../hooks/api'
import { useSession } from '../session-context'

export default ({ onSubmit, clusters, team = {} }): any => {
  const { isAdmin } = useSession()
  const role = isAdmin ? 'admin' : 'team'
  const myTeam = team === null ? undefined : team
  const handleSubmit = ({ schema, uiSchema, formData, edit, errors }): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  const uiSchema = schema.getTeamUiSchema(mySchema, role)

  return (
    <div className='Team'>
      <h2>Team details:</h2>

      <Form
        key='createTeam'
        schema={mySchema}
        uiSchema={uiSchema}
        // onChange={handleChange}
        onSubmit={handleSubmit}
        formData={myTeam}
        liveValidate={false}
        showErrorList={false}
      >
        <Button color='primary' type='submit'>
          Submit
        </Button>
      </Form>
    </div>
  )
}
