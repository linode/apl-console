import { AppBar, Box, Button, Chip, Grid, Link, Tab, Tabs, Typography } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import { getSpec } from 'common/api-spec'
import { JSONSchema7 } from 'json-schema'
import { cloneDeep, get, isEqual, set, unset } from 'lodash'
import { CrudProps, ValuesSchema } from 'pages/types'
import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { GetAppApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { cleanLink, getAppData } from 'utils/data'
import { extract, getAppSchemaName, isOf } from 'utils/schema'
import YAML from 'yaml'
import { useSession } from 'providers/Session'
import CodeEditor from './CodeEditor'
import HeaderTitle from './HeaderTitle'
import TabPanel from './TabPanel'
import InformationBanner from './InformationBanner'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
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
  tableBackground: {
    backgroundColor: theme.palette.background.paper,
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

export const getAppUiSchema = (appsEnabled: Record<string, any>, appId: string, formData): any => {
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
      set(uiSchema, 'customRootCA.ui:widget', 'hidden')
      set(uiSchema, 'customRootCAKey.ui:widget', 'hidden')
      set(uiSchema, 'byoWildcardCert.ui:widget', 'hidden')
      set(uiSchema, 'byoWildcardCertKey.ui:widget', 'hidden')
      set(uiSchema, 'stage.ui:widget', 'hidden')
      set(uiSchema, 'email.ui:widget', 'hidden')
      if (formData.issuer === 'letsencrypt') {
        unset(uiSchema, 'stage.ui:widget')
        unset(uiSchema, 'email.ui:widget')
      }

      if (formData.issuer === 'byo-wildcard-cert') {
        unset(uiSchema, 'byoWildcardCert.ui:widget')
        set(uiSchema, 'byoWildcardCert.ui:widget', 'TextareaWidget')
        unset(uiSchema, 'byoWildcardCertKey.ui:widget')
      }
      if (formData.issuer === 'custom-ca') {
        unset(uiSchema, 'customRootCA.ui:widget')
        unset(uiSchema, 'customRootCAKey.ui:widget')
        set(uiSchema, 'customRootCA.ui:widget', 'TextareaWidget')
      }
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
      set(uiSchema, 'database.ui:widget', 'hidden')

      break
    case 'grafana':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      break
    case 'keycloak':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      set(uiSchema, 'postgresqlPassword.ui:widget', 'hidden')
      break
    case 'loki':
      set(uiSchema, 'adminPassword.ui:widget', 'hidden')
      break
    case 'prometheus':
      set(uiSchema, 'remoteWrite.rwConfig.customConfig.ui:widget', 'textarea')
      break
    default:
      break
  }
  return uiSchema
}

interface Props extends CrudProps, GetAppApiResponse {
  teamId: string
  setAppState: CallableFunction
  managed?: boolean
}
export default function App({
  id,
  teamId,
  enabled,
  values: inValues,
  rawValues: inRawValues,
  mutating,
  managed,
  onSubmit,
}: Props): React.ReactElement {
  const location = useLocation()
  const hash = location.hash.substring(1)
  const hashMap = {
    info: 0,
    values: 1,
  }
  const { classes } = useStyles()
  const session = useSession()
  const { appsEnabled } = session
  const { appInfo, deps, logo, logoAlt } = getAppData(session, teamId, id)
  const defTab = hashMap[hash] ?? hashMap.info
  const [tab, setTab] = useState(defTab)
  const handleTabChange = (event, tab) => {
    setTab(tab)
  }
  const [isEdit, setIsEdit] = useState(false)
  // setters for the tab forms
  const [values, setValues] = useState(inValues)
  // validation state
  const [validValues, setValidValues] = useState(true)
  const { t } = useTranslation()
  useEffect(() => {
    if (inValues !== values) {
      setValues(inValues)
      setValidValues(true)
    }
  }, [inValues])

  // END HOOKS
  const appSchema = id.startsWith('ingress-nginx')
    ? (session.valuesSchema as ValuesSchema).properties.apps.properties['ingress-nginx-platform']
    : (session.valuesSchema as ValuesSchema).properties.apps.properties[id]
  const valuesYaml = isEqual(values, {}) ? '' : YAML.stringify(values)
  const isAdminApps = teamId === 'admin'

  const handleSubmit = () => {
    const data = { id, teamId, values }
    if (validValues) onSubmit(data)
  }

  const handleValuesChange = (values: Props['values'], errors: any[]) => {
    setValues(values)
    setValidValues(errors.length === 0)
  }

  const prefixedDeps = () => {
    let dependencies: string
    if (!deps) return 'None'
    deps.forEach((dep: string) => {
      const preFixedDep = dep.charAt(0).toUpperCase() + dep.slice(1)
      if (!dependencies) dependencies = preFixedDep
      else dependencies += `, ${preFixedDep}`
    })
    return dependencies
  }

  return (
    <Box>
      {appInfo.isDeprecated && <InformationBanner message={appInfo.deprecationInfo.message} />}
      {managed !== undefined && managed && (id === 'external-dns' || id === 'cert-manager') && (
        <InformationBanner message='This App is managed by Akamai Connected Cloud and cannot be changed!' />
      )}
      {managed !== undefined && managed && id !== 'external-dns' && id !== 'cert-manager' && (
        <InformationBanner message='This app is not supported when installed by Akamai Connected Cloud!' />
      )}
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
          {isAdminApps && appSchema && (enabled || enabled === undefined) && (
            <Tab href='#values' label={t('Values')} value={hashMap.values} />
          )}
        </Tabs>
      </AppBar>
      <TabPanel value={tab} index={hashMap.info}>
        <Grid container direction='row' className={classes.tableBackground}>
          <Grid item xs='auto' md='auto'>
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
                    <TableRow key='dependencies' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Dependencies:')} />
                      </TableCell>
                      <TableCell align='left'>{prefixedDeps()}</TableCell>
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
                altColor
              />
            </Box>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={tab} index={hashMap.values}>
        {appSchema && (
          <>
            <CodeEditor
              code={valuesYaml}
              onChange={(data) => {
                setValues(data || {})
              }}
              disabled={!isEdit}
              setValid={setValidValues}
              validationSchema={appSchema}
            />
            <Box display='flex' flexDirection='row-reverse' m={1}>
              <Button
                color='primary'
                variant='contained'
                data-cy='button-edit-values'
                onClick={() => {
                  if (isEdit) handleSubmit()
                  setIsEdit(!isEdit)
                }}
                disabled={!validValues || managed}
              >
                {isEdit ? t('Submit') : t('Edit')}
              </Button>
            </Box>
          </>
        )}
      </TabPanel>
    </Box>
  )
}
