import { RuleEffect } from '@jsonforms/core'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'

import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import Form from 'react-jsonschema-form-bs4'
import { getSchema } from '../hooks/api'

export default ({ onSubmit, clusters, team = {} }): any => {
  const myTeam = team === null ? undefined : team
  const [formData, setFormData] = useState(myTeam)
  const [submitActive, setSubmitActive] = useState(false)
  const handleChange = ({ errors, data }): any => {
    if ((!errors || !errors.length) && data) {
      setSubmitActive(true)
    }
  }
  const handleSubmit = (form): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  console.log(mySchema)
  const form = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/name',
      },
      {
        type: 'Control',
        scope: '#/properties/clusters',

        options: {
          detail: 'DEFAULT',
        },
      },
    ],
  }

  return (
    <div className='Team'>
      <h2>Team details:</h2>

      <JsonForms
        schema={mySchema}
        onChange={handleChange}
        uischema={form}
        data={myTeam}
        renderers={materialRenderers}
        cells={materialCells}
      />
      <Button color='primary' onClick={handleSubmit} disabled={!submitActive}>
        Submit
      </Button>
    </div>
  )
}
