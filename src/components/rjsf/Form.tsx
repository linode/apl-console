import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { FormProps } from '@rjsf/core'
import HelpButton from '../HelpButton'
import FieldTemplate from './FieldTemplate/FieldTemplate'
import ObjectFieldTemplate from './ObjectFieldTemplate'
import TitleField from './TitleField'
import ArrayField from './ArrayField'
import DescriptionField from './DescriptionField'
import OneOfField from './OneOfField'
// import SchemaField from './SchemaField'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
)

interface Props extends FormProps<any> {
  title?: any
  key: string
}

export default ({ children, title, ...props }: Props): React.ReactElement => {
  const { schema } = props
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const classes = useStyles()
  return (
    <>
      <div className={classes.root}>
        {title}
        {docUrl && <HelpButton id='form' size='small' href={`${docUrl}`} />}
      </div>
      <Form
        ObjectFieldTemplate={ObjectFieldTemplate}
        FieldTemplate={FieldTemplate}
        fields={{ ArrayField, TitleField, DescriptionField, OneOfField }}
        {...props}
      >
        {children}
      </Form>
    </>
  )
}
