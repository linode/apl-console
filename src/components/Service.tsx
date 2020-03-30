import { JsonFormsCore } from '@jsonforms/core';
import {materialCells, materialRenderers} from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { Button } from '@material-ui/core';
import { isEmpty } from 'lodash/lang'
import React, { useState } from 'react'
import { getSchema } from '../hooks/api'
// import EmptyDictRender from '../utils/jsonforms/EmptyDictRender'
// import EmptyDictTester from '../utils/jsonforms/EmptyDictTester'
import HiddenFieldRender from '../utils/jsonforms/HiddenFieldRender'
import HiddenFieldTesterFactory from '../utils/jsonforms/HiddenFieldTesterFactory'

export default ({ onSubmit, clusters, service = {} }): any => {
  const [formData, setFormData] = useState(service)
  const [submitActive, setSubmitActive] = useState(false)

  const handleChange = (state: Pick<JsonFormsCore, 'data' | 'errors'>): any => {
    if (isEmpty(state.errors) && !isEmpty(state.data)) {
      setSubmitActive(true)
      setFormData(state.data)
    }
  }
  const handleSubmit = (): any => {
    onSubmit(formData)
  }

  const schema = getSchema()
  const mySchema = schema.getServiceSchema(clusters)


  const HiddenFieldsTester = HiddenFieldTesterFactory(['teamId', 'serviceId', 'dummyProperty'])
  return (
    <div className='Service'>
      <h2>Service:</h2>
      <JsonForms
        schema={mySchema}
        data={formData}
        renderers={[
          ...materialRenderers,
          // { tester: EmptyDictTester, renderer: EmptyDictRender },
          { tester: HiddenFieldsTester, renderer: HiddenFieldRender }
        ]}
        cells={materialCells}
        onChange={handleChange}
      />
      <Button color='primary' onClick={handleSubmit} disabled={!submitActive}>
        Submit
      </Button>
    </div>
  )
}
