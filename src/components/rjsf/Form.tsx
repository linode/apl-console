import React from 'react'
import Form from '@rjsf/material-ui'
import { FormProps, IChangeEvent } from '@rjsf/core'
import validator from '@rjsf/core/dist/cjs/validate'
import { get, isEqual } from 'lodash'
import { makeStyles } from 'common/theme'
import { cleanData } from 'utils/data'
import HelpButton from 'components/HelpButton'
import FieldTemplate from './FieldTemplate/FieldTemplate'
import ObjectFieldTemplate from './ObjectFieldTemplate'
import TitleField from './TitleField'
import ArrayField from './ArrayField'
import DescriptionField from './DescriptionField'
import OneOfField from './OneOfField'
import RadioWidget from './RadioWidget'
import StringField from './StringField'
import CheckboxesWidget from './CheckboxesWidget'

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

interface Props extends FormProps<any> {
  title?: any
  key: string
  hideHelp?: boolean
  clean?: boolean
}

export default ({
  children,
  title,
  hideHelp = false,
  onChange,
  onSubmit,
  clean = true,
  liveValidate,
  ...props
}: Props): React.ReactElement => {
  const { schema }: any = props
  // const rules = schema['x-rules'] ?? undefined
  // const MoForm = rules ? applyRules(schema, uiSchema, rules, Engine)(Form) : Form
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const { classes } = useStyles()
  const onChangeWrapper = ({ formData, ...rest }: IChangeEvent<any>, errors) => {
    const cleanFormData = clean ? cleanData(formData) : formData
    // const cleanFormData = formData
    onChange({ formData: cleanFormData, ...rest }, errors)
  }
  const onSubmitWrapper = ({ formData, ...rest }: IChangeEvent<any>, ev) => {
    const cleanFormData = clean ? cleanData(formData) : formData
    // nullify(cleanFormData)
    // const cleanFormData = formData
    onSubmit({ formData: cleanFormData, ...rest }, ev)
  }
  const validate = (formData, errors): any => {
    const cleanFormData = clean ? cleanData(formData) : formData
    const e = validator(cleanFormData, schema)
    e.errors.forEach((err, i) => {
      const { name, property, message } = err
      const leaf = property.substr(1, property.lastIndexOf('.') - 1)
      const p = property.substr(property.lastIndexOf('.'))
      const prop = get(cleanFormData, leaf)
      if (name !== 'required' || !isEqual(prop, {})) {
        get(errors, property.substr(1)).addError(message)
        // eslint-disable-next-line no-underscore-dangle
        // errors.addError(err)
      }
    })
    return errors
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
        liveValidate={liveValidate ?? false}
        showErrorList={false}
        noHtml5Validate
        // validate={validate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        FieldTemplate={FieldTemplate}
        fields={{ ArrayField, DescriptionField, OneOfField, StringField, TitleField }}
        widgets={{ CheckboxesWidget, RadioWidget }}
        onChange={onChangeWrapper}
        onSubmit={onSubmitWrapper}
        // noValidate
        {...props}
      >
        {children}
      </Form>
    </>
  )
}
