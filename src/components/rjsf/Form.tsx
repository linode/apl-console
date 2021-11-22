import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core'
import Form from '@rjsf/material-ui'
import { FormProps, IChangeEvent } from '@rjsf/core'
// import applyRules from 'rjsf-conditionals'
// import { Engine } from 'json-rules-engine-simplified'
import HelpButton from '../HelpButton'
import FieldTemplate from './FieldTemplate/FieldTemplate'
import ObjectFieldTemplate from './ObjectFieldTemplate'
import TitleField from './TitleField'
import ArrayField from './ArrayField'
import DescriptionField from './DescriptionField'
import OneOfField from './OneOfField'
import RadioWidget from './RadioWidget'
import StringField from './StringField'
import { cleanData } from '../../utils/data'
import CheckboxesWidget from './CheckboxesWidget'

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

export default ({ children, title, hideHelp = false, onChange, onSubmit, ...props }: Props): React.ReactElement => {
  const { schema }: any = props
  // const rules = schema['x-rules'] ?? undefined
  // const MoForm = rules ? applyRules(schema, uiSchema, rules, Engine)(Form) : Form
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const classes = useStyles()
  const onChangeWrapper = ({ formData, ...rest }: IChangeEvent<any>, errors) => {
    const cleanFormData = cleanData(formData)
    onChange({ formData: cleanFormData, ...rest }, errors)
  }
  const onSubmitWrapper = ({ formData, ...rest }: IChangeEvent<any>) => {
    const cleanFormData = cleanData(formData)
    onSubmit({ formData: cleanFormData, ...rest })
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
        fields={{ ArrayField, DescriptionField, OneOfField, StringField, TitleField }}
        widgets={{ CheckboxesWidget, RadioWidget }}
        onChange={onChangeWrapper}
        onSubmit={onSubmitWrapper}
        {...props}
      >
        {children}
      </Form>
    </>
  )
}
