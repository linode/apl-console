import { AppBar, Box, Button, List, ListItem, ListSubheader, Tab, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { TabContext, TabList, TabPanel } from '@material-ui/lab'
import { isEqual } from 'lodash'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { dump, load } from 'js-yaml'
import { JSONSchema7 } from 'json-schema'
import { useSession } from '../session-context'
import { getAppData } from '../utils/data'
import AppCard from './AppCard'
import CodeEditor from './CodeEditor'
import MuiLink from './MuiLink'
import Form from './rjsf/Form'
import { getAppSchema, getAppUiSchema } from '../api-spec'

const contextPath = process.env.CONTEXT_PATH || ''

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noTabs: {
      padding: theme.spacing(3),
    },
    disabled: {
      backgroundColor: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  }),
)

export default ({
  id,
  teamId,
  values: inValues,
  rawValues: inRawValues,
  shortcuts: inShortcuts,
  onSubmit,
}: any): React.ReactElement => {
  const location = useLocation()
  const hash = location.hash.substring(1)
  const hashMap = {
    shortcuts: '1',
    values: '2',
    rawvalues: '3',
  }
  const classes = useStyles()
  const session = useSession()
  const { cluster } = session

  const { schema, baseUrl, link, logo, enabled, shortcuts: defaultShortcuts } = getAppData(session, teamId, id)
  const { description, title } = schema
  const disabled = enabled === false
  const defTab = hashMap[hash] ?? (link ? '1' : '2')
  const [tab, setTab] = useState(defTab)
  const handleTabChange = (event, tab) => {
    setTab(tab)
  }
  const [isEdit, setIsEdit] = useState(false)
  const [shortcuts, setShortcuts] = useState(inShortcuts)
  const [shortcutsValid, setShortcutsValid] = useState(inShortcuts)
  const [values, setValues] = useState(inValues)
  const [rawValues, setRawValues] = useState(inRawValues)
  const [dirty, setDirty] = useState(false)
  const [valuesDirty, setValuesDirty] = useState(false)
  const [valid, setValid] = useState(true)

  const [appSchema, setAppSchema]: [JSONSchema7, CallableFunction] = useState()
  const [appUiSchema, setAppUiSchema] = useState()

  const handleChangeShortcuts = ({ formData, errors }) => {
    setShortcuts(formData)
    setShortcutsValid(errors.length === 0)
    setDirty(!isEqual(formData, inShortcuts))
  }
  const handleChangeValues = ({ formData }) => {
    setValues(formData)
    const d = !isEqual(formData, inValues)
    setDirty(d)
    setValuesDirty(d)
    const newAppSchema = getAppSchema(id, cluster, values).properties?.values
    const newAppUiSchema = getAppUiSchema(id, cluster, values)
    setAppSchema(newAppSchema)
    setAppUiSchema(newAppUiSchema)
  }
  if (!(appSchema || appUiSchema)) {
    handleChangeValues({ formData: values || {} })
    return null
  }
  const handleChangeRawValues = (data) => {
    setRawValues(data)
    setDirty(!isEqual(data, inRawValues))
    setValid(true)
  }

  const handleSubmit = () => {
    const data = { id, teamId, values, rawValues, shortcuts }
    if (dirty) {
      onSubmit(data)
      setDirty(false)
      setValuesDirty(false)
    }
  }

  const yaml = isEqual(rawValues, {}) ? '' : dump(rawValues)

  const isAdminApps = teamId === 'admin'

  const shortcutsPanel = (
    <>
      <Typography component='h6' variant='h6'>
        Shortcuts
      </Typography>
      {link && defaultShortcuts?.length && (
        <List
          subheader={
            <ListSubheader component='div'>
              <u>Provided by Otomi:</u>
            </ListSubheader>
          }
        >
          {(defaultShortcuts || []).map((s) => (
            <ListItem key={s.title}>
              <MuiLink href={`${baseUrl}${s.path}`} target='_blank' rel='noopener'>
                <b>{s.title}</b>: {s.description}
              </MuiLink>
            </ListItem>
          ))}
        </List>
      )}
      <List
        subheader={
          link && defaultShortcuts?.length && shortcuts?.length ? (
            <ListSubheader component='div'>
              <u>User created:</u>
            </ListSubheader>
          ) : undefined
        }
      >
        {(shortcuts || []).map((s) => (
          <ListItem key={s.title}>
            <MuiLink href={`${baseUrl}${s.path}`} target='_blank' rel='noopener'>
              <b>{s.title}</b>: {s.description}
            </MuiLink>
          </ListItem>
        ))}
        {link && isEdit && (
          <Form
            key='editShortcuts'
            schema={schema.properties.shortcuts}
            onChange={handleChangeShortcuts}
            formData={shortcuts}
            hideHelp
            clean={false}
            liveValidate
          >
            <></>
          </Form>
        )}
      </List>
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button
          color='primary'
          variant='contained'
          data-cy='button-edit-values'
          onClick={() => {
            if (isEdit) handleSubmit()
            setIsEdit(!isEdit)
          }}
          disabled={isEdit && !shortcutsValid}
        >
          {isEdit ? 'Submit' : 'Edit'}
        </Button>
      </Box>
    </>
  )
  return (
    <Box className={disabled ? ` ${classes.disabled}` : ''}>
      <AppCard
        cluster={cluster}
        teamId={teamId}
        title={title}
        link={link}
        img={`${contextPath}/logos/${logo}`}
        disabled={disabled}
        wide
        hideSettings
        docUrl={schema['x-externalDocsPath']}
        shortDescription={schema['x-short']}
        description={description}
      />
      {isAdminApps && (
        <TabContext value={tab}>
          <AppBar position='static'>
            <TabList value={tab} onChange={handleTabChange}>
              <Tab href='#info' label='Info' value='1' disabled={!link} />
              {isAdminApps && <Tab href='#values' label='Values' value='2' disabled={!appSchema || !inValues} />}
              {isAdminApps && (
                <Tab href='#rawvalues' label='Raw Values' value='3' disabled={!appSchema || !inRawValues} />
              )}
            </TabList>
          </AppBar>
          <TabPanel value='1'>{shortcutsPanel}</TabPanel>
          {inValues && (
            <TabPanel value='2'>
              <Typography component='h6' variant='h6'>
                Values
              </Typography>
              <Typography component='h6' variant='caption'>
                Edit the configuration values of {title}.
              </Typography>
              <Form
                key='editValues'
                schema={appSchema}
                onChange={handleChangeValues}
                onSubmit={handleSubmit}
                formData={values}
                hideHelp
                uiSchema={appUiSchema}
              >
                <Box display='flex' flexDirection='row-reverse' m={1}>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={!valuesDirty}
                    data-cy='button-submit-values'
                  >
                    Submit
                  </Button>
                </Box>
              </Form>
            </TabPanel>
          )}
          {inValues && (
            <TabPanel value='3'>
              <Typography component='h6' variant='h6'>
                Raw Values
              </Typography>
              <Typography component='h6' variant='caption'>
                Allows direct editing of otomi-core/charts/{id} values. Implies knowledge of its structure. Has no
                schema support so edit at your own risk!
              </Typography>
              <CodeEditor code={yaml} onChange={handleChangeRawValues} disabled={!isEdit} invalid={!valid} />
              <Box display='flex' flexDirection='row-reverse' m={1}>
                <Button
                  color='primary'
                  variant='contained'
                  data-cy='button-edit-rawvalues'
                  onClick={() => {
                    if (isEdit) handleSubmit()
                    setIsEdit(!isEdit)
                  }}
                  disabled={!valid}
                >
                  {isEdit ? 'Submit' : 'Edit'}
                </Button>
              </Box>
            </TabPanel>
          )}
        </TabContext>
      )}
      {!isAdminApps && <div className={classes.noTabs}>{shortcutsPanel}</div>}
    </Box>
  )
}
