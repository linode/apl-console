import { FormProps, IChangeEvent, withTheme } from '@rjsf/core'
import { Theme5 } from '@rjsf/material-ui'
import HelpButton from 'components/HelpButton'
import { each, get, isEqual } from 'lodash'
import React from 'react'
import { makeStyles } from 'tss-react/mui'
import { cleanData } from 'utils/data'
import ArrayField from './ArrayField'
import CheckboxesWidget from './CheckboxesWidget'
import CheckboxWidget from './CheckboxWidget'
import DescriptionField from './DescriptionField'
import ArrayFieldTemplate from './FieldTemplate/ArrayFieldTemplate'
import FieldTemplate from './FieldTemplate/FieldTemplate'
import ObjectFieldTemplate from './ObjectFieldTemplate'
import OneOfField from './OneOfField'
import RadioWidget from './RadioWidget'
import StringField from './StringField'
import TitleField from './TitleField'

const Form = withTheme(Theme5)

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

export default function ({
  children,
  title,
  hideHelp = false,
  onChange,
  onSubmit,
  liveValidate,
  ...props
}: Props): React.ReactElement {
  const { schema }: any = props
  // const rules = schema['x-rules'] ?? undefined
  // const MoForm = rules ? applyRules(schema, uiSchema, rules, Engine)(Form) : Form
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const { classes } = useStyles()
  const onChangeWrapper = ({ formData, ...other }: IChangeEvent<any>) => {
    const cleanFormData = cleanData(formData)
    onChange({ formData: cleanFormData, ...other })
  }
  const onSubmitWrapper = ({ formData, ...other }: IChangeEvent<any>, ev) => {
    // const cleanFormData = clean ? cleanData(formData, undefined, schema) : formData
    // nullify(cleanFormData)
    const cleanFormData = formData
    onSubmit({ formData: cleanFormData, ...other }, ev)
  }
  const validate = (formData, errors, ajvErrors): any => {
    each(ajvErrors, (err) => {
      const { name, property, message } = err
      const leaf = property.substr(1, property.lastIndexOf('.') - 1)
      const prop = get(formData, leaf)
      // we exclude the error if it is about required props in a nested child obj
      // when the parent is not requiring the nested prop itself
      if (prop && (name !== 'required' || !isEqual(prop, {}))) {
        const errObj = get(errors, property.substr(1))
        // eslint-disable-next-line no-underscore-dangle
        if (errObj && !errObj.__errors.includes(err.message)) errObj.addError(err.message)
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
        // customValidateOnly
        ArrayFieldTemplate={ArrayFieldTemplate}
        ObjectFieldTemplate={ObjectFieldTemplate}
        FieldTemplate={FieldTemplate}
        fields={{ ArrayField, DescriptionField, OneOfField, StringField, TitleField }}
        widgets={{ CheckboxWidget, CheckboxesWidget, RadioWidget }}
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
