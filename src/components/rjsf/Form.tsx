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
import StringField from './StringField'
import { cleanData } from '../../utils/data'

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
  hideHelp?: boolean
}

export default ({ children, title, hideHelp = false, ...props }: Props): React.ReactElement => {
  const { schema, onChange, onSubmit }: any = props
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const classes = useStyles()
  const onChangeWrapper = ({ formData }, errors) => {
    const cleanFormData = cleanData(formData)
    onChange({ formData: cleanFormData }, errors)
  }
  const onSubmitWrapper = ({ formData }) => {
    const cleanFormData = cleanData(formData)
    onSubmit({ formData: cleanFormData })
  }
  return (
    <>
      {!hideHelp && (
        <div className={classes.root}>
          {title}
          {docUrl && <HelpButton id='form' size='small' href={`${docUrl}`} />}
        </div>
      )}
      <Form
        liveValidate={false}
        showErrorList={false}
        ObjectFieldTemplate={ObjectFieldTemplate}
        FieldTemplate={FieldTemplate}
        fields={{ ArrayField, TitleField, DescriptionField, OneOfField, StringField }}
        onChange={onChangeWrapper}
        onSubmit={onSubmitWrapper}
        {...props}
      >
        {children}
      </Form>
    </>
  )
}
