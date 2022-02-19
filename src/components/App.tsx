import { AppBar, Box, Button, List, ListItem, ListSubheader, Tabs, Tab, Typography } from '@mui/material'
import { isEqual } from 'lodash'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { dump } from 'js-yaml'
import { JSONSchema7 } from 'json-schema'
import { makeStyles } from 'tss-react/mui'
import { getAppSchema, getAppUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { getAppData } from 'utils/data'
import AppCard from './AppCard'
import CodeEditor from './CodeEditor'
import MuiLink from './MuiLink'
import Form from './rjsf/Form'
import TabPanel from './TabPanel'

const useStyles = makeStyles()((theme) => ({
  noTabs: {
    padding: theme.spacing(3),
  },
  disabled: {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  panelHeader: {
    padding: theme.spacing(1),
  },
}))

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
    shortcuts: 0,
    values: 1,
    rawvalues: 2,
  }
  const { classes } = useStyles()
  const session = useSession()
  const { cluster } = session

  const { schema, baseUrl, link, logo, enabled, shortcuts: defaultShortcuts } = getAppData(session, teamId, id)
  const { description, title } = schema
  const disabled = enabled === false
  const defTab = hashMap[hash] ?? (link ? 0 : 1)
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
    const newAppSchema = getAppSchema(id).properties?.values
    const newAppUiSchema = getAppUiSchema(id)
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
      <Box className={classes.panelHeader} component='div'>
        <Typography variant='h6'>Shortcuts</Typography>
      </Box>
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
          />
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
        img={`/logos/${logo}`}
        disabled={disabled}
        wide
        hideSettings
        docUrl={schema['x-externalDocsPath']}
        shortDescription={schema['x-short']}
        description={description}
      />
      {isAdminApps && (
        <>
          <AppBar position='relative' color='primary'>
            <Tabs value={tab} onChange={handleTabChange} textColor='secondary' indicatorColor='secondary'>
              <Tab href='#info' label='Info' value={0} disabled={!link} />
              {isAdminApps && <Tab href='#values' label='Values' value={1} disabled={!appSchema || !inValues} />}
              {isAdminApps && (
                <Tab href='#rawvalues' label='Raw Values' value={2} disabled={!appSchema || !inRawValues} />
              )}
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            {shortcutsPanel}
          </TabPanel>
          {inValues && (
            <TabPanel value={tab} index={1}>
              <Box className={classes.panelHeader} component='div'>
                <Typography variant='h6'>Values</Typography>
                <Typography variant='caption'>Edit the configuration values of {title}.</Typography>
              </Box>
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
            <TabPanel value={tab} index={2}>
              <Box className={classes.panelHeader} component='div'>
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
              </Box>
            </TabPanel>
          )}
        </>
      )}
      {!isAdminApps && <div className={classes.noTabs}>{shortcutsPanel}</div>}
    </Box>
  )
}
