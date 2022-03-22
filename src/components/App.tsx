import { PlayCircleFilled as PlayIcon } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  List,
  ListItem,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { getAppSchema, getAppUiSchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { JSONSchema7 } from 'json-schema'
import { isEqual } from 'lodash'
import Markdown from 'markdown-to-jsx'
import React, { ChangeEvent, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { getAppData } from 'utils/data'
import YAML from 'yaml'
import Checkbox from './Checkbox'
import CodeEditor from './CodeEditor'
import MuiLink from './MuiLink'
import Form from './rjsf/Form'
import TabPanel from './TabPanel'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  headerText: {},
  headerButtons: {
    marginLeft: 'auto',
  },
  imgHolder: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    display: 'inline-flex',
    // width: theme.spacing(8),
  },
  img: {
    height: theme.spacing(6),
  },
  content: {
    paddingBottom: theme.spacing(2),
  },
  paragraph: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
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
  enabled,
  values: inValues,
  rawValues: inRawValues,
  shortcuts: inShortcuts,
  setAppState,
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
  const {
    baseUrl,
    externalUrl,
    hasShortcuts,
    logo,
    schema,
    shortcuts: defaultShortcuts,
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
  // END HOOKS
  const handleChangeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    const { deps } = getAppData(session, teamId, id)
    setAppState([(deps || []).concat([id]), enabled])
  }

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

  const playButtonProps =
    enabled !== false && externalUrl
      ? { LinkComponent: Link, href: externalUrl, target: '_blank', rel: 'noopener' }
      : {}
  return (
    <Box>
      <Box className={classes.header}>
        <Box className={classes.imgHolder}>
          <img className={classes.img} src={`/logos/${logo}`} alt={`Logo for ${title} app`} />
        </Box>
        <Box className={classes.headerText}>
          <Typography className={classes.headerText} variant='h6'>
            {title}: {schema['x-short']}
          </Typography>
        </Box>
        <Box className={classes.headerButtons}>
          <ButtonGroup variant='outlined' color='primary' size='large'>
            {enabled !== undefined && (
              <Checkbox onChange={handleChangeEnabled} checked={enabled !== false} disabled={!isAdminApps} />
            )}
            {enabled !== false && externalUrl && (
              <IconButton color='primary' size='large' {...playButtonProps} disabled={!isAdminApps}>
                <PlayIcon color={enabled !== false ? 'primary' : 'disabled'} />
              </IconButton>
            )}
          </ButtonGroup>
        </Box>
      </Box>
      <AppBar position='relative' color='primary'>
        <Tabs value={tab} onChange={handleTabChange} textColor='secondary' indicatorColor='secondary'>
          <Tab href='#info' label='Info' value={0} />
          <Tab href='#shortcuts' label='Shortcuts' value={1} disabled={!hasShortcuts} />
          {isAdminApps && <Tab href='#values' label='Values' value={2} disabled={!appSchema || !inValues} />}
          {isAdminApps && <Tab href='#rawvalues' label='Raw Values' value={3} disabled={!appSchema || !inRawValues} />}
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <Box className={classes.panelHeader}>
          <Box className={classes.content}>
            <Typography variant='h5'>About {title}</Typography>
            <Typography className={classes.paragraph} component='p' variant='body2'>
              {description}
            </Typography>
            <Link href={schema['x-externalDocsPath']}>[...more]</Link>
          </Box>
          <Box className={classes.content}>
            <Typography variant='h5'>How did Otomi integrate {title}?</Typography>
            <Markdown>{schema['x-info'] || `No info defined yet for ${title}`}</Markdown>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Box className={classes.panelHeader}>
          <Typography variant='h5'>Shortcuts</Typography>
        </Box>
        {hasShortcuts && defaultShortcuts?.length && (
          <List
            subheader={
              <ListSubheader>
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
              <ListSubheader>
                <u>User created:</u>
              </ListSubheader>
            ) : undefined
          }
        >
          {(shortcuts || []).map((s) => {
            const href = `${s.baseUrl}${s.path}`
            return (
              <ListItem key={s.title}>
                {enabled !== false ? (
                  <MuiLink key={href} href={href} target='_blank' rel='noopener' label={title} about={description}>
                    <b>{s.title}</b>: {s.description}
                  </MuiLink>
                ) : (
                  <Typography key={href} variant='body2' color='action.disabled'>
                    <b>{s.title}</b>: {s.description}
                  </Typography>
                )}
              </ListItem>
            )
          })}
          {hasShortcuts && isEdit && (
            <Form
              key='editShortcuts'
              schema={schema.properties.shortcuts}
              onChange={handleChangeShortcuts}
              formData={shortcuts}
              hideHelp
              clean={false}
              liveValidate
              disabled={enabled === false}
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
      </TabPanel>
      {inValues && (
        <TabPanel value={tab} index={2}>
          <Box className={classes.panelHeader}>
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
          <Box className={classes.panelHeader}>
            <Typography variant='h5'>Raw Values</Typography>
            <Typography variant='caption'>
              Allows direct editing of otomi-core/charts/{id} values. Implies knowledge of its structure. Has no schema
              support so edit at your own risk!
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
    </Box>
  )
}
