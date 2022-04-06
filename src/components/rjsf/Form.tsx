import { IChangeEvent, UiSchema, withTheme } from '@rjsf/core'
import { Theme5 } from '@rjsf/material-ui'
import ButtonGroup from 'components/ButtonGroup'
import HelpButton from 'components/HelpButton'
import { JSONSchema7 } from 'json-schema'
import { isEqual, some } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'
import { cleanData, deepDiff } from 'utils/data'
import { nullify } from 'utils/schema'
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
    '& .MuiGrid-item': {
      padding: '16px !important',
    },
  },
}))

interface Props {
  idProp?: string
  data: Record<string, any>
  resourceType?: string
  resourceName?: string
  adminOnly?: boolean
  disabled?: boolean
  liveValidate?: boolean
  children?: any
  title?: any
  hideHelp?: boolean
  clean?: boolean
  setData?: CallableFunction
  setDirty?: CallableFunction
  onDelete?: CallableFunction
  onError?: CallableFunction
  onSubmit?: CallableFunction
  schema: JSONSchema7
  uiSchema?: UiSchema
}

export default function ({
  idProp = 'id',
  adminOnly = false,
  disabled,
  resourceName,
  resourceType,
  liveValidate,
  clean = true,
  title,
  hideHelp = false,
  onDelete,
  onError,
  onSubmit,
  data,
  setData,
  schema,
  children,
  ...other
}: Props): React.ReactElement {
  const { user: isAdmin, oboTeamId } = useSession()
  const { classes } = useStyles()
  // const [state, setState] = useState(data)
  const [isDirty, setDirty] = useState(false)
  const { t } = useTranslation()
  // END HOOKS
  const id = data?.[idProp]
  const key = `${resourceType}-${resourceName}`
  const action = !idProp || id ? 'edit' : 'new'
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined

  const onChangeWrapper = ({ formData: changedFormData, errors }: IChangeEvent<any>) => {
    const cleanFormData = clean ? cleanData(changedFormData, { emptyArrays: false }) : changedFormData
    const diff = data && deepDiff(cleanFormData, data)
    const d = !isEqual(cleanFormData, data)
    if (d) {
      // we got *potentially* dirty data, strip out rjsf constructs that trigger new array forms
      if (diff && some(diff, (val) => !(isEqual(val, '[{}]') || isEqual(val, '[undefined]')))) setDirty(true)
    } else setDirty(false)
    if (onError && errors.length && liveValidate) onError(errors, cleanFormData)
    setData(cleanFormData)
    // setState(cleanFormData)
  }
  const onSubmitWrapper = ({ formData, errors }: IChangeEvent<any>, ev) => {
    const cleanFormData = clean ? cleanData(formData) : formData
    const nulledCleanFormData = nullify(cleanFormData)
    if (onError && errors.length && !liveValidate) onError(errors, nulledCleanFormData)
    else onSubmit(nulledCleanFormData)
  }
  // const validate = (formData, errors, ajvErrors): any => {
  //   each(ajvErrors, (err) => {
  //     const { name, property, message } = err
  //     const leaf = property.substr(1, property.lastIndexOf('.') - 1)
  //     const prop = get(formData, leaf)
  //     // we exclude the error if it is about required props in a nested child obj
  //     // when the parent is not requiring the nested prop itself
  //     if (prop && (name !== 'required' || !isEqual(prop, {}))) {
  //       const errObj = get(errors, property.substr(1))
  //       // eslint-disable-next-line no-underscore-dangle
  //       if (errObj && !errObj.__errors.includes(err.message)) errObj.addError(err.message)
  //     }
  //   })
  //   return errors
  // }
  return (
    <>
      {!hideHelp && (
        <div className={classes.root}>
          <h1 data-cy={`h1-${action}-${key}`}>
            {adminOnly && t('FORM_TITLE', { model: resourceType, name: resourceName })}
            {!adminOnly && id && t('FORM_TITLE_TEAM', { model: resourceType, name: resourceName, teamId: oboTeamId })}
            {!adminOnly && !id && t('FORM_TITLE_TEAM_NEW', { model: resourceType, teamId: oboTeamId })}
          </h1>
          {docUrl && <HelpButton id='form' size='small' href={`${docUrl}`} />}
        </div>
      )}
      <Form
        formData={data}
        key={`${resourceType}-${resourceName}`}
        schema={schema}
        liveValidate={liveValidate || false}
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
        disabled={disabled}
        // noValidate
        {...other}
      >
        {children || (
          <ButtonGroup
            id={id}
            resourceName={resourceName}
            resourceType={resourceName}
            disabled={disabled || !isDirty}
            onDelete={onDelete}
          />
        )}
      </Form>
    </>
  )
}
