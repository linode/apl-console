import {
  AppBar,
  Box,
  Button,
  Chip,
  Grid,
  Link,
  List,
  ListItem,
  ListSubheader,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { getSpec } from 'common/api-spec'
import useAuthzSession from 'hooks/useAuthzSession'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, get, isEqual, set } from 'lodash'
import Markdown from 'markdown-to-jsx'
import { CrudProps } from 'pages/types'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { GetAppApiResponse, GetSettingsApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { cleanLink, getAppData } from 'utils/data'
import { extract, getAppSchemaName, isOf } from 'utils/schema'
import YAML from 'yaml'
import CodeEditor from './CodeEditor'
import HeaderTitle from './HeaderTitle'
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
  legend: {
    paddingTop: theme.spacing(3),
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
    paddingRight: theme.spacing(2),
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
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
  },
  tableHead: {
    // minWidth: theme.spacing(12),
  },
}))

export const getAppSchema = (appId: string, formData): any => {
  const modelName = getAppSchemaName(appId)
  const schema = cloneDeep(getSpec().components.schemas[modelName]) as Record<string, any>
  switch (appId) {
    case 'cert-manager':
      if (formData.issuer === 'letsencrypt') schema.properties.values.required = ['email']
      else delete schema.properties.values.required
      break
    default:
      break
  }
  return schema
}

export const getAppUiSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  appId: string,
  formData,
): any => {
  const modelName = getAppSchemaName(appId)
  const model = getSpec().components.schemas[modelName].properties.values
  const uiSchema = {}
  if (model) {
    const leafs = Object.keys(extract(model, (o: JSONSchema7) => o.type === 'object' && !o.properties && !isOf(o)))
    leafs.forEach((path) => {
      set(uiSchema, path, { 'ui:widget': CodeEditor })
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
    case 'gitea':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      set(uiSchema, 'postgresqlPassword.ui:widget', 'hidden')
      break
    case 'harbor':
      set(uiSchema, 'databasePassword.ui:widget', 'hidden')
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      set(uiSchema, 'core.ui:widget', 'hidden')
      set(uiSchema, 'registry.ui:widget', 'hidden')
      set(uiSchema, 'jobservice.ui:widget', 'hidden')
      set(uiSchema, 'secretKey.ui:widget', 'hidden')
      break
    case 'grafana':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      break
    case 'keycloak':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      set(uiSchema, 'postgresqlPassword.ui:widget', 'hidden')
      break
    case 'kubeapps':
      set(uiSchema, 'postgresqlPassword.ui:widget', 'hidden')
      break
    case 'kubeclarity':
      set(uiSchema, 'databasePassword.ui:widget', 'hidden')
      break
    case 'loki':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      break
    case 'prometheus':
      set(uiSchema, 'remoteWrite.rwConfig.customConfig.ui:widget', 'textarea')
      break
    case 'velero':
      const cloudprovider = get(formData, 'cloud')
      if (cloudprovider?.type === 'azure') {
        set(uiSchema, 'storage.azureBlob.tenantId.ui:widget', 'hidden')
        set(uiSchema, 'storage.azureBlob.subscriptionId.ui:widget', 'hidden')
        set(uiSchema, 'storage.azureBlob.aadClientId.ui:widget', 'hidden')
        set(uiSchema, 'storage.azureBlob.aadClientSecret.ui:widget', 'hidden')
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
    appInfo,
    baseUrl,
    hasShortcuts,
    logo,
    logoAlt,
    schema,
    shortcuts: defaultShortcuts,
  } = getAppData(session, teamId, id)
  const defTab = hashMap[hash] ?? hashMap.info
  const [tab, setTab] = useState(defTab)
  const handleTabChange = (event, tab) => {
    setTab(tab)
  }
  const [isEdit, setIsEdit] = useState(false)
  // setters for the tab forms
  const [shortcuts, setShortcuts] = useState(inShortcuts)
  const [values, setValues] = useState(inValues)
  const [rawValues, setRawValues] = useState(inRawValues)
  // validation state
  const [validShortcuts, setValidShortcuts] = useState(true)
  const [validValues, setValidValues] = useState(true)
  const [validRaw, setValidRaw] = useState(true)
  const { t } = useTranslation()
  useEffect(() => {
    if (inValues !== values) {
      setValues(inValues)
      setValidValues(true)
    }
    if (inRawValues !== rawValues) {
      setRawValues(inRawValues)
      setValidRaw(true)
    }
    if (inShortcuts !== shortcuts) {
      setShortcuts(inShortcuts)
      setValidShortcuts(true)
    }
  }, [inValues, inRawValues, inShortcuts])

  // END HOOKS
  const appSchema = getAppSchema(id, values).properties?.values
  const appUiSchema = getAppUiSchema(appsEnabled, settings, id, values)
  const yaml = isEqual(rawValues, {}) ? '' : YAML.stringify(rawValues)
  const isAdminApps = teamId === 'admin'

  const handleSubmit = () => {
    const data = { id, teamId, values, rawValues, shortcuts }
    if (validValues && validRaw && validShortcuts) onSubmit(data)
  }

  const handleShortcutsChange = (shortcuts: Props['shortcuts'], errors: any[]) => {
    setShortcuts(shortcuts)
    setValidShortcuts(errors.length === 0)
  }
  const handleValuesChange = (values: Props['values'], errors: any[]) => {
    setValues(values)
    setValidValues(errors.length === 0)
  }
  const renderShortcuts = (s) => {
    const href = `${baseUrl}${s.path}`
    return (
      <ListItem key={`${s.teamId}-${s.title}`}>
        {enabled !== false ? (
          <MuiLink key={href} href={href} target='_blank' rel='noopener' title={s.title} about={s.description}>
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
              // eslint-disable-next-line no-param-reassign
              currentTarget.onerror = null // prevents looping
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = `/logos/${logoAlt}`
            }}
            alt={`Logo for ${appInfo.title} app`}
          />
        </Box>
        <Box className={classes.headerText}>
          <Typography className={classes.headerText} variant='h6'>
            {appInfo.title}
          </Typography>
        </Box>
      </Box>
      <AppBar position='relative' color='default' sx={{ borderRadius: '8px' }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 1 }}>
          <Tab href='#info' label='Info' value={hashMap.info} />
          <Tab
            href='#shortcuts'
            label={t('Shortcuts')}
            value={hashMap.shortcuts}
            disabled={enabled === false || !hasShortcuts}
          />
          {isAdminApps && (
            <Tab href='#values' label={t('Values')} value={hashMap.values} disabled={enabled === false || !appSchema} />
          )}
          {isAdminApps && (
            <Tab
              href='#rawvalues'
              label={t('Raw values')}
              value={hashMap.rawvalues}
              disabled={enabled === false || !appSchema}
            />
          )}
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={hashMap.info}>
        <Grid container direction='row'>
          <Grid item xs={12} md={6}>
            <Box className={classes.content}>
              <TableContainer className={classes.legend}>
                <Table size='small' aria-label='simple table'>
                  <TableBody>
                    <TableRow key='version' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Version:')} />
                      </TableCell>
                      <TableCell align='left'>{appInfo.appVersion}</TableCell>
                    </TableRow>
                    <TableRow key='repo' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Repo:')} />
                      </TableCell>
                      <TableCell align='left'>
                        <Link href={appInfo.repo} target='_blank' rel='noopener' title={id}>
                          {cleanLink(appInfo.repo as string)}
                        </Link>
                      </TableCell>
                    </TableRow>
                    <TableRow key='maintainers' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Maintainers:')} />
                      </TableCell>
                      <TableCell align='left'>{appInfo.maintainers}</TableCell>
                    </TableRow>
                    <TableRow key='links' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Related links:')} />
                      </TableCell>
                      <TableCell align='left'>
                        {appInfo.relatedLinks.map((l: string) => (
                          <>
                            <Link href={l} target='_blank' rel='noopener'>
                              {cleanLink(l)}
                            </Link>
                            <br />
                          </>
                        ))}
                      </TableCell>
                    </TableRow>
                    <TableRow key='license' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('License:')} />
                      </TableCell>
                      <TableCell align='left'>{appInfo.license}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.content}>
              <HeaderTitle
                title={t('FORM_ABOUT', { title: appInfo.title })}
                description={appInfo.about}
                resourceType='App'
              />
              <HeaderTitle title={t('FORM_HEAD_ABOUT', { title: appInfo.title })} resourceType='App' />
              <Markdown>{appInfo.integration || `No info defined yet for ${appInfo.title}`}</Markdown>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tab} index={hashMap.shortcuts}>
        <HeaderTitle
          title={t('Shortcuts')}
          description={t('FORM_SHORTCUTS_DESC', { title: appInfo.title })}
          resourceType='Shortcut'
        />
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
            disabled={enabled === false || (isEdit && !validShortcuts)}
          >
            {isEdit ? t('submit') : t('edit')}
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={hashMap.values}>
        {appSchema && (
          <Form
            adminOnly
            description={t('FORM_HEAD_APP_EDIT', { title: appInfo.title })}
            data={values}
            schema={appSchema}
            uiSchema={appUiSchema}
            onChange={handleValuesChange}
            onSubmit={handleSubmit}
            resourceType='Values'
            idProp={null}
            mutating={mutating}
          />
        )}
      </TabPanel>
      <TabPanel value={tab} index={hashMap.rawvalues}>
        <HeaderTitle title={t('Raw values')} description={t('FORM_WARNING_RAW_VALUES', { id })} resourceType='Values' />
        <div className={classes.buffer}> </div>
        <CodeEditor
          code={yaml}
          onChange={(data) => {
            setRawValues(data || {})
          }}
          disabled={!isEdit}
          setValid={setValidRaw}
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
            disabled={!validRaw}
          >
            {isEdit ? t('Submit') : t('Edit')}
          </Button>
        </Box>
      </TabPanel>
    </Box>
  )
}
