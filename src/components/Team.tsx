
import { Button } from '@material-ui/core'
import React from 'react'
import { withTheme } from 'react-jsonschema-form';
import { Theme as MuiTheme } from 'rjsf-material-ui';
import { getSchema } from '../hooks/api'

const Form = withTheme(MuiTheme);

export default ({ onSubmit, clusters, team = {} }): any => {
  const myTeam = team === null ? undefined : team
  const handleSubmit = ({schema, uiSchema, formData, edit, errors}): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  const uiSchema = schema.getTeamUiSchema(mySchema)

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
        <Button color='primary' type="submit">
          Submit
        </Button>
      </Form>
    </div>
  )
}
