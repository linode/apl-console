import { PlayCircleFilled as PlayIcon } from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  IconButton,
  Link,
  List,
  ListItem,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import { pascalCase } from 'change-case'
import { getSpec } from 'common/api-spec'
import useAuthzSession from 'hooks/useAuthzSession'
import { cloneDeep, get, isEqual, set } from 'lodash'
import Markdown from 'markdown-to-jsx'
import { CrudProps } from 'pages/types'
import React, { ChangeEvent, useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { GetAppApiResponse, GetSettingsApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { getAppData } from 'utils/data'
import { extract, isOf, nullify } from 'utils/schema'
import YAML from 'yaml'
import CodeEditor from './CodeEditor'
import Header from './Header'
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
  buffer: {
    height: theme.spacing(2),
  },
}))

export const getAppSchema = (appId): any => {
  const modelName = `App${pascalCase(appId)}`
  const schema = cloneDeep(getSpec().components.schemas[modelName])
  switch (appId) {
    default:
      break
  }
  return schema
}

export const getAppUiSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  appId,
  formData,
): any => {
  const modelName = `App${pascalCase(appId)}`
  const model = getSpec().components.schemas[modelName].properties.values
  const uiSchema = {}
  if (model) {
    const leafs = Object.keys(extract(model, (o) => o.type === 'object' && !o.properties && !isOf(o) && !o.nullable))
    leafs.forEach((path) => {
      set(uiSchema, path, { 'ui:FieldTemplate': CodeEditor })
    })
  }
  switch (appId) {
    case 'cert-manager':
      if (formData.issuer === 'custom-ca') set(uiSchema, 'stage.ui:widget', 'hidden')
      break
    case 'drone':
      const provider = get(formData, 'sourceControl.provider')
      if (!provider) {
        set(uiSchema, 'adminUser.ui:widget', 'hidden')
        set(uiSchema, 'adminToken.ui:widget', 'hidden')
        set(uiSchema, 'orgsFilter.ui:widget', 'hidden')
        set(uiSchema, 'repo.ui:widget', 'hidden')
        set(uiSchema, 'repoFilter.ui:widget', 'hidden')
      }
      if (provider !== 'github') {
        set(uiSchema, 'githubAdmins.ui:widget', 'hidden')
        set(uiSchema, 'sharedSecret.ui:widget', 'hidden')
      }
      break
    default:
      break
  }
  return uiSchema
}

interface Props extends CrudProps, GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
}
export default function ({
  id,
  teamId,
  enabled,
  values: inValues,
  rawValues: inRawValues,
  shortcuts: inShortcuts,
  setAppState,
  mutating,
  onSubmit,
}: Props): React.ReactElement {
  const location = useLocation()
  const hash = location.hash.substring(1)
  const hashMap = {
    info: 0,
    shortcuts: 1,
    values: 2,
    rawvalues: 3,
  }
  const { classes } = useStyles()
  const session = useAuthzSession()
  const { appsEnabled, settings } = session
  const {
    baseUrl,
    externalUrl,
    hasShortcuts,
    logo,
    logoAlt,
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
  const [shortcutsValid, setShortcutsValid] = useState(true)
  const [values, setValues] = useState(inValues)
  const isDirty = !isEqual(values, inValues)
  const [rawValues, setRawValues] = useState(inRawValues)
  const [valid, setValid] = useState(true)
  const { t } = useTranslation()
  useEffect(() => {
    if (inValues !== values) setValues(inValues)
    if (inRawValues !== rawValues) setValues(inRawValues)
    if (inShortcuts !== shortcuts) setValues(inShortcuts)
  }, [inValues, inRawValues, inShortcuts])
  // END HOOKS
  const appSchema = getAppSchema(id).properties?.values
  const appUiSchema = getAppUiSchema(appsEnabled, settings, id, values)
  const yaml = isEqual(rawValues, {}) ? '' : YAML.stringify(rawValues)
  const isAdminApps = teamId === 'admin'
  const playButtonProps = { LinkComponent: Link, href: externalUrl, target: '_blank', rel: 'noopener' }

  const handleChangeEnabled = (event: ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked
    const { deps } = getAppData(session, teamId, id)
    setAppState([(deps || []).concat([id]), enabled])
  }
  const handleShortcutsChange = (shortcuts: Props['shortcuts'], errors: any[]) => {
    setShortcuts(shortcuts)
    setShortcutsValid(errors.length === 0)
  }
  const handleSubmit = () => {
    const data = { id, teamId, values: nullify(values), rawValues, shortcuts }
    if (isDirty) onSubmit(data)
  }
  const renderShortcuts = (s) => {
    const href = `${baseUrl}${s.path}`
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
  }

  return (
    <Box>
      <Helmet title={t('TITLE_APP', { appId: id, role: teamId === 'admin' ? 'admin' : 'team', tab: hash })} />
      <Box className={classes.header}>
        <Box className={classes.imgHolder}>
          <img
            className={classes.img}
            src={`/logos/${logo}`}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null // prevents looping
              currentTarget.src = `/logos/${logoAlt}`
            }}
            alt={`Logo for ${title} app`}
          />
        </Box>
        <Box className={classes.headerText}>
          <Typography className={classes.headerText} variant='h6'>
            {title}: {schema['x-short']}
          </Typography>
        </Box>
        <Box className={classes.headerButtons}>
          <ButtonGroup
            variant='contained'
            color='primary'
            size='large'
            disableElevation
            sx={{
              backgroundColor: 'primary.main',
            }}
          >
            <Checkbox
              title={enabled ? 'This app is enabled' : 'This app is disabled. Check to enable.'}
              onChange={handleChangeEnabled}
              checked={enabled !== false}
              disabled={!isAdminApps || enabled !== false}
              size='medium'
              sx={{
                color: !isAdminApps || enabled ? 'action.disabled' : 'white',
              }}
            />
            <IconButton size='large' {...playButtonProps} disabled={enabled === false}>
              <PlayIcon
                sx={{
                  color: enabled === false ? 'action.disabled' : 'white',
                }}
              />
            </IconButton>
          </ButtonGroup>
        </Box>
      </Box>
      <AppBar position='relative' color='primary'>
        <Tabs value={tab} onChange={handleTabChange} textColor='secondary' indicatorColor='secondary'>
          <Tab href='#info' label='Info' value={0} />
          <Tab href='#shortcuts' label={t('Shortcuts')} value={1} disabled={!hasShortcuts} />
          {isAdminApps && <Tab href='#values' label={t('Values')} value={2} disabled={!appSchema || !inValues} />}
          {isAdminApps && (
            <Tab href='#rawvalues' label={t('Raw values')} value={3} disabled={!appSchema || !inRawValues} />
          )}
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={0}>
        <Header title={t('FORM_ABOUT', { title })} description={description} resourceType='App' />
        <Link href={schema['x-externalDocsPath']}>[...more]</Link>
        <div className={classes.buffer}> </div>
        <Box className={classes.content}>
          <Typography variant='h5'>{t('FORM_HEAD_ABOUT', { title })}</Typography>
          <Markdown>{schema['x-info'] || `No info defined yet for ${title}`}</Markdown>
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Header title={t('Shortcuts')} description={t('FORM_SHORTCUTS_DESC', { title })} resourceType='Shortcut' />
        {hasShortcuts && defaultShortcuts?.length && (
          <List
            subheader={
              <ListSubheader>
                <Typography variant='caption'>Provided by Otomi:</Typography>
              </ListSubheader>
            }
          >
            {(defaultShortcuts || []).map((s) => renderShortcuts(s))}
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
          {(shortcuts || []).map((s) => renderShortcuts(s))}
          {hasShortcuts && isEdit && (
            <Form
              schema={schema.properties.shortcuts}
              onChange={handleShortcutsChange}
              data={shortcuts}
              hideHelp
              clean={false}
              liveValidate
              disabled={enabled === false}
              resourceType='Shortcut'
              resourceName={id}
              mutating={mutating}
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
            disabled={enabled === false || (isEdit && !shortcutsValid)}
          >
            {isEdit ? t('submit') : t('edit')}
          </Button>
        </Box>
      </TabPanel>
      {inValues && (
        <TabPanel value={tab} index={2}>
          <Form
            adminOnly
            description={t('FORM_HEAD_APP_EDIT', { title })}
            data={values}
            schema={appSchema}
            uiSchema={appUiSchema}
            onChange={setValues}
            onSubmit={handleSubmit}
            resourceType='Values'
            idProp={null}
            mutating={mutating}
          />
        </TabPanel>
      )}
      {inValues && (
        <TabPanel value={tab} index={3}>
          <Header title={t('Raw values')} description={t('FORM_WARNING_RAW_VALUES', { id })} resourceType='Values' />
          <div className={classes.buffer}> </div>
          <CodeEditor
            code={yaml}
            onChange={(data) => setRawValues(data || {})}
            disabled={!isEdit}
            setValid={setValid}
          />
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
              {isEdit ? t('Submit') : t('Edit')}
            </Button>
          </Box>
        </TabPanel>
      )}
    </Box>
  )
}
