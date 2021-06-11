import React from 'react'
import Form from './rjsf/Form'
import ObjectFieldTemplate from './rjsf/ObjectFieldTemplate'

interface Props {
  schema: any
}

export default ({ schema }: Props): React.ReactElement => {
  return (
    <Form
      title='setting'
      key='settings'
      schema={schema}
      liveValidate={false}
      showErrorList={false}
      ObjectFieldTemplate={ObjectFieldTemplate}
    />
  )
}
