import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonForms } from '@jsonforms/react'
import { Button } from '@material-ui/core'
import { isEmpty } from 'lodash/lang'
import React, { useState } from 'react'
import { getSchema } from '../hooks/api'
import HiddenFieldRender from '../utils/jsonforms/HiddenFieldRender'
import HiddenFieldTesterFactory from '../utils/jsonforms/HiddenFieldTesterFactory'

export default ({ onSubmit, clusters, team = {} }): any => {
  const myTeam = team === null ? undefined : team
  const [formData, setFormData] = useState(myTeam)
  const [submitActive, setSubmitActive] = useState(false)
  const handleChange = ({ errors, data }): any => {
    if (isEmpty(errors) && !isEmpty(data)) {
      debugger
      setSubmitActive(true)
    } else {
      setSubmitActive(false)
    }
    setFormData(data)
  }
  const handleSubmit = (): any => {
    onSubmit(formData)
  }
  const schema = getSchema()
  const mySchema = schema.getTeamSchema(clusters)

  const HiddenFieldsTester = HiddenFieldTesterFactory(['teamId', 'serviceId', 'dummyProperty', 'password'])

  return (
    <div className='Team'>
      <h2>Team details:</h2>

      <JsonForms
        schema={mySchema}
        onChange={handleChange}
        data={formData}
        renderers={[...materialRenderers, { tester: HiddenFieldsTester, renderer: HiddenFieldRender }]}
        cells={materialCells}
      />
      <Button color='primary' onClick={handleSubmit} disabled={!submitActive}>
        Submit
      </Button>
    </div>
  )
}
