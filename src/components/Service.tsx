import { JsonFormsCore } from '@jsonforms/core';
import {materialCells, materialRenderers} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import React from 'react'
import { getSchema } from '../hooks/api'
// import EmptyDictRender from '../utils/jsonforms/EmptyDictRender'
// import EmptyDictTester from '../utils/jsonforms/EmptyDictTester'
import HiddenFieldRender from '../utils/jsonforms/HiddenFieldRender'
import HiddenFieldTesterFactory from '../utils/jsonforms/HiddenFieldTesterFactory'

export default ({ onSubmit, clusters, service = {} }): any => {
  const handleSubmit = (form): any => {
    onSubmit(form.formData)
  }
  const schema = getSchema()
  const mySchema = schema.getServiceSchema(clusters)
  // const uiSchema = schema.getServiceUiSchema(mySchema)
  const uiJsonFormSchema = {
    type: 'VerticalLayout',
    elements: [
      
      {
        "type": "Control",
        "scope": "#/properties/hasPublicUrl",
        // "options": {format: 'radio'},
      },
      // {
      //   "type": "Control",
      //   "scope": "#/properties/ingress",
      //   "rule": {
      //     "effect": "HIDE",
      //     "condition": {
      //       "scope": "#/properties/hasPublicUrl",
      //       "schema": {
      //         "const": false
      //       }
      //     }
      //   }
      // },      
      {
        "type": "Control",
        "scope": "#/properties/teamId",
        "rule": {
          "effect": "HIDE",
          "condition": {
            "scope": "#/properties/dummy",
            "schema": {
              "const": false
            }
          }
        }  
      }
    ],
  }

  const HiddenFieldsTester = HiddenFieldTesterFactory(['teamId', 'serviceId'])
  return (
    <div className='Service'>
      <h2>Service:</h2>
      <JsonForms
        schema={mySchema}
        // uischema={uiJsonFormSchema}
        data={service}
        renderers={[
          ...materialRenderers,
          // { tester: EmptyDictTester, renderer: EmptyDictRender },
          { tester: HiddenFieldsTester, renderer: HiddenFieldRender }
        ]}
        cells={materialCells}
        onChange={ (state: Pick<JsonFormsCore, 'data' | 'errors'>): void => { console.log(state)}}
      />
    </div>
  )
}
