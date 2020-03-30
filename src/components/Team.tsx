import { RuleEffect } from '@jsonforms/core';
import {materialCells, materialRenderers} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';

import React from 'react'
import Form from 'react-jsonschema-form-bs4'
import { getSchema } from '../hooks/api'
import CustomDescriptionField from './CustomDescriptionField'

const fields = {
  DescriptionField: CustomDescriptionField,
}

export default ({ onSubmit, clusters, team = {} }): any => {
  const handleSubmit = (form): any => {
    onSubmit(form.formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)
  const uiSchema = schema.getTeamUiSchema(mySchema)
  console.log(mySchema);
  const form = {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Control",
        "scope": "#/properties/name"
      },
      {
        "type": "Control",
        "scope": "#/properties/clusters",

        options: {
          detail: 'DEFAULT'
        }
      }
    ]
  }

  return (
    <div className='Team'>
      <h2>Team details:</h2>
      
      <JsonForms
        schema={mySchema}
        uischema={form}
        data={team}
        renderers={materialRenderers}
        cells={materialCells}
      />
      
      <Form
        key='createTeam'
        schema={mySchema}
        fields={fields}
        uiSchema={uiSchema}
        onSubmit={handleSubmit}
        onError={console.error}
        formData={team}
        // liveValidate={true}
      />
    </div>
  )
}
