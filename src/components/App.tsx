import { AppBar, Box, Button, List, ListItem, ListSubheader, Tab, Tabs, Typography } from '@mui/material'
import { getAppSchema, getAppUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { JSONSchema7 } from 'json-schema'
import { isEqual } from 'lodash'
import Markdown from 'markdown-to-jsx'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { getAppData } from 'utils/data'
import YAML from 'yaml'
import AppCard from './AppCard'
import CodeEditor from './CodeEditor'
import MuiLink from './MuiLink'
import Form from './rjsf/Form'
import TabPanel from './TabPanel'

const useStyles = makeStyles()((theme) => ({
  noTabs: {
    padding: theme.spacing(3),
  },
  panelHeader: {
    padding: theme.spacing(1),
  },
  buffer: {
    height: theme.spacing(2),
  },
}))

export default function ({
  id,
  teamId,
  values: inValues,
  rawValues: inRawValues,
  shortcuts: inShortcuts,
  onSubmit,
}: any): React.ReactElement {
  const location = useLocation()
  const hash = location.hash.substring(1)
  const hashMap = {
    info: 0,
    shortcuts: 1,
    values: 2,
    rawvalues: 3,
  }
  const { classes } = useStyles()
  const session = useSession()
  const { cluster } = session

  const {
    baseUrl,
    enabled,
    externalUrl,
    hasShortcuts,
    ingress,
    logo,
    schema,
    shortcuts: defaultShortcuts,
    useHost,
  } = getAppData(session, teamId, id)
  const { description, title } = schema
  const defTab = hashMap[hash] ?? 0
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
    const newAppUiSchema = getAppUiSchema(id, formData)
    setAppSchema(newAppSchema)
    setAppUiSchema(newAppUiSchema)
  }
  if (!(appSchema || appUiSchema)) {
    handleChangeValues({ formData: values || {} })
    return null
  }
  const handleChangeRawValues = (inData) => {
    const data = inData || {}
    setRawValues(data)
    setDirty(!isEqual(data, inRawValues))
  }

  const handleSubmit = () => {
    const data = { id, teamId, values, rawValues, shortcuts }
    if (dirty) {
      onSubmit(data)
      setDirty(false)
      setValuesDirty(false)
    }
  }

  const yaml = isEqual(rawValues, {}) ? '' : YAML.stringify(rawValues)

  const isAdminApps = teamId === 'admin'

  const shortcutsPanel = (
    <>
      <Box className={classes.panelHeader} component='div'>
        <Typography variant='h5'>Shortcuts</Typography>
      </Box>
      {hasShortcuts && defaultShortcuts?.length && (
        <List
          subheader={
            <ListSubheader component='div'>
              <Typography variant='caption'>Provided by Otomi:</Typography>
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
          hasShortcuts && defaultShortcuts?.length && shortcuts?.length ? (
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
        {hasShortcuts && isEdit && (
          <Form
            key='editShortcuts'
            schema={schema.properties.shortcuts}
            onChange={handleChangeShortcuts}
            formData={shortcuts}
            hideHelp
            clean={false}
            liveValidate
          >
            <div />
          </Form>
        )}
      </List>
      <Box display='flex' flexDirection='row-reverse' m={1}>
        <Button
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
    <Box>
      <AppCard
        cluster={cluster}
        description={description}
        docUrl={schema['x-externalDocsPath']}
        externalUrl={externalUrl}
        hideSettings
        img={`/logos/${logo}`}
        shortDescription={schema['x-short']}
        teamId={teamId}
        title={title}
        wide
      />
      {isAdminApps && (
        <>
          <AppBar position='relative' color='primary'>
            <Tabs value={tab} onChange={handleTabChange} textColor='secondary' indicatorColor='secondary'>
              <Tab href='#info' label='Info' value={0} />
              <Tab href='#shortcuts' label='Shortcuts' value={1} disabled={!ingress} />
              {isAdminApps && <Tab href='#values' label='Values' value={2} disabled={!appSchema || !inValues} />}
              {isAdminApps && (
                <Tab href='#rawvalues' label='Raw Values' value={3} disabled={!appSchema || !inRawValues} />
              )}
            </Tabs>
          </AppBar>
          <TabPanel value={tab} index={0}>
            <Box className={classes.panelHeader} component='div'>
              <Typography variant='h5'>How did Otomi integrate {title}?</Typography>
              <Markdown>{schema['x-info'] || `No info defined yet for ${title}`}</Markdown>
            </Box>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            {shortcutsPanel}
          </TabPanel>
          {inValues && (
            <TabPanel value={tab} index={2}>
              <Box className={classes.panelHeader} component='div'>
                <Typography variant='h5'>Values</Typography>
                <Typography variant='caption'>Edit the configuration values of {title}.</Typography>
              </Box>
              <Form
                key='editValues'
                schema={appSchema}
                onChange={handleChangeValues}
                onSubmit={handleSubmit}
                formData={values}
                clean={false}
                hideHelp
                uiSchema={appUiSchema}
              >
                <Box display='flex' flexDirection='row-reverse' m={1}>
                  <Button type='submit' disabled={!valuesDirty} data-cy='button-submit-values'>
                    Submit
                  </Button>
                </Box>
              </Form>
            </TabPanel>
          )}
          {inValues && (
            <TabPanel value={tab} index={3}>
              <Box className={classes.panelHeader} component='div'>
                <Typography variant='h5'>Raw Values</Typography>
                <Typography variant='caption'>
                  Allows direct editing of otomi-core/charts/{id} values. Implies knowledge of its structure. Has no
                  schema support so edit at your own risk!
                </Typography>
                <div className={classes.buffer}> </div>
                <CodeEditor code={yaml} onChange={handleChangeRawValues} disabled={!isEdit} setValid={setValid} />
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
