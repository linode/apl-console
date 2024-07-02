import { IChangeEvent, UiSchema, withTheme } from '@rjsf/core'
import { Theme5 } from '@rjsf/material-ui'
import ButtonGroup from 'components/ButtonGroup'
import HeaderTitle from 'components/HeaderTitle'
import { JSONSchema7 } from 'json-schema'
import { isEqual } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cleanData } from 'utils/data'
import { nullify } from 'utils/schema'
import { makeStyles } from 'tss-react/mui'
import ArrayField from './ArrayField'
import CheckboxesWidget from './CheckboxesWidget'
import CheckboxWidget from './CheckboxWidget'
import CodeEditorWidget from './CodeEditorWidget'
import DescriptionField from './DescriptionField'
import ArrayFieldTemplate from './FieldTemplate/ArrayFieldTemplate'
import FieldTemplate from './FieldTemplate/FieldTemplate'
import ObjectFieldTemplate from './ObjectFieldTemplate'
import OneOfField from './OneOfField'
import RadioWidget from './RadioWidget'
import StringField from './StringField'
import TitleField from './TitleField'

const Form = withTheme(Theme5)

const useStyles = makeStyles()((theme) => ({
  form: {
    backgroundColor: theme.palette.background.default,
    borderRadius: 0,
  },
  formAlterantive: {
    backgroundColor: 'background.contrast',
    borderRadius: 0,
  },
}))

interface Props extends CrudProps {
  idProp?: string
  nameProp?: string
  description?: string
  data: Record<string, any>
  resourceType?: string
  resourceName?: string
  adminOnly?: boolean
  disabled?: boolean
  deleteDisabled?: boolean
  liveValidate?: boolean
  children?: any
  title?: any
  hideHelp?: boolean
  clean?: boolean
  setDirty?: CallableFunction
  schema: JSONSchema7
  uiSchema?: UiSchema
  altColor?: boolean
}

export default function ({
  idProp = 'id',
  nameProp = 'name',
  mutating,
  adminOnly = false,
  disabled,
  deleteDisabled = false,
  resourceType,
  liveValidate,
  title: inTitle,
  hideHelp = false,
  onChange,
  onDelete,
  onSubmit,
  data,
  schema,
  children,
  altColor,
  ...other
}: Props): React.ReactElement {
  const { oboTeamId } = useSession()
  const [originalState, setOriginalState] = useState<Record<string, any>>(cleanData(data) || {})
  const [state, setState] = useState<Record<string, any>>(data) // initial state set to first time data, must rely on setData from here on
  const resourceName = other.resourceName ?? data?.[nameProp]
  useEffect(() => {
    setState(data)
  }, [data])
  const [isDirty, setDirty] = useState(false)
  const { t } = useTranslation()
  const { classes } = useStyles()
  // END HOOKS
  const id = data?.[idProp]
  const docUrl = schema && schema['x-externalDocsPath'] ? `https://otomi.io/${schema['x-externalDocsPath']}` : undefined
  const keepValues = [[{}]] // rjsf structs that open parts of the form, may not be stripped
  const onChangeWrapper = ({ formData, errors }: IChangeEvent<Record<string, unknown>>) => {
    // lets check if form data is dirty (has meaningful changes)
    const cleanFormDataStripped = cleanData(formData) // strip all empty structs except empty arrays
    const d = originalState && !isEqual(cleanFormDataStripped, originalState)
    setDirty(d) // compare with initial data
    // only now do we set the state of the form, as rjsf needs to update the form values once with defaults
    // finally we send the fully stripped version to subscribers
    const cleanFormData = cleanData(formData, {
      keepValues,
      emptyArrays: false,
      emptyObjects: false,
      undefinedArrayValues: false,
    })
    if (onChange) onChange(cleanFormData, errors)
    // keep local state for form sync
    setState(cleanFormData)
  }
  const onSubmitWrapper = ({ formData }: IChangeEvent<Record<string, unknown>>): void => {
    // keep undefineds to nullify below, allowing api to unset paths in nested structures
    const cleanFormData = cleanData(formData, { emptyArrays: false, undefinedValues: false })
    const nulledCleanFormData = nullify(cleanFormData, schema)
    onSubmit(nulledCleanFormData)
    // setState(undefined)
    setOriginalState(cleanData(formData) || {})
    setDirty(false)
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
  let title: string
  if (adminOnly && idProp && !id) title = t('FORM_TITLE_NEW', { model: t(resourceType) })
  if (adminOnly && ((idProp && id) || !idProp) && resourceName)
    title = t('FORM_TITLE_NAMED', { model: t(resourceType), name: resourceName })
  if (adminOnly && !idProp && !resourceName) title = t('FORM_TITLE', { model: t(resourceType) })
  if (!adminOnly && id) title = t('FORM_TITLE_TEAM', { model: t(resourceType), name: resourceName, teamId: oboTeamId })
  if (!adminOnly && !id) title = t('FORM_TITLE_TEAM_NEW', { model: t(resourceType), teamId: oboTeamId })

  return (
    <>
      {!hideHelp && <HeaderTitle title={inTitle || title} resourceType={resourceType} docUrl={docUrl} />}
      <Form
        className={altColor ? classes.formAlterantive : classes.form}
        formData={state}
        key={`${resourceType}${data?.id ? `-${data.id}` : ''}`}
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
        widgets={{ CheckboxWidget, CheckboxesWidget, RadioWidget, CodeEditorWidget }}
        onChange={onChangeWrapper}
        onSubmit={onSubmit && onSubmitWrapper}
        disabled={disabled || mutating}
        // noValidate
        {...other}
      >
        {children || (
          <ButtonGroup
            id={id}
            loading={mutating}
            resourceName={resourceName}
            resourceType={resourceType}
            disabled={disabled || !isDirty}
            deleteDisabled={deleteDisabled || mutating}
            onDelete={onDelete}
          />
        )}
      </Form>
    </>
  )
}
