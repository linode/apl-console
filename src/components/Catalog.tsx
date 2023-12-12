/* eslint-disable react/button-has-type */
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Link,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import { cloneDeep, omit } from 'lodash'
import { CrudProps } from 'pages/types'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse } from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { makeStyles } from 'tss-react/mui'
import { cleanLink } from 'utils/data'
import cssStyles from 'utils/cssStyles'
import Form from './rjsf/Form'
import WorkloadValues from './WorkloadValues'
import DeleteButton from './DeleteButton'
import TabPanel from './TabPanel'
import InformationBanner from './InformationBanner'
import Iconify from './Iconify'

const useStyles = makeStyles()((theme) => ({
  header: {
    ...cssStyles(theme).bgBlur({ color: theme.palette.background.paper }),
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    left: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    borderRadius: '8px',
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
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
  },
}))

const checkImageFields = (data: any) => {
  if (data?.repository && data?.tag) return ''
  if (data?.repository) return "The 'tag' field for the image should be filled in!"
  if (data?.tag) return "The 'repository' field for the image should be filled in!"
  return "The 'repository' and 'tag' fields for the image should be filled in!"
}

const calculateTop = (scrollPosition: number, globalError: boolean): string => {
  if (globalError) return `${scrollPosition > 140 ? scrollPosition - 72 : 88}px`
  return `${scrollPosition > 90 ? scrollPosition - 72 : 0}px`
}

export const getValuesDocLink = (url: string, path: string): string => {
  if (process.env.NODE_ENV === 'development') return `${url.replace('.git', '')}/blob/main/${path}/values.yaml`
  return `${url.replace('.git', '')}/src/branch/main/${path}/values.yaml`
}

export const getWorkloadSchema = (): any => {
  return cloneDeep(getSpec().components.schemas.Workload)
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    'ui:description': ' ',
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    icon: { 'ui:widget': 'hidden' },
    url: { 'ui:widget': 'hidden' },
    chartProvider: { 'ui:widget': 'hidden' },
    chartMetadata: { 'ui:widget': 'hidden' },
    path: { 'ui:widget': 'hidden' },
    chart: { 'ui:widget': 'hidden' },
    revision: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: any
  workloadId?: string
  values?: any
  createWorkload: any
  updateWorkload: any
  updateWorkloadValues: any
  deleteWorkload: any
}

export default function ({
  teamId,
  workload,
  workloadId,
  values,
  createWorkload,
  updateWorkload,
  updateWorkloadValues,
  deleteWorkload,
  ...other
}: Props): React.ReactElement {
  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation()
  const { classes } = useStyles()
  const dispatch = useAppDispatch()
  const { appsEnabled, user } = useSession()
  const globalError = useAppSelector(({ global: { error } }) => error)
  const hash = location.hash.substring(1)
  const hashMap = {
    info: 0,
    values: 1,
  }
  const defTab = hashMap[hash] ?? hashMap.info
  const [tab, setTab] = useState(defTab)
  const handleTabChange = (event, tab) => {
    // on the values tab, reset the values to see the comments in the code editor
    if (tab === 1 && !workloadId) setWorkloadValues(values)
    setTab(tab)
  }
  const [data, setData] = useState<any>(workload)
  const [workloadValues, setWorkloadValues] = useState<any>(values)
  const [scrollPosition, setScrollPosition] = useState(0)
  const icon = data?.icon || '/logos/otomi_logo.svg'

  const handleScroll = () => {
    const position = window.scrollY
    setScrollPosition(position)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!workload) return
    setWorkloadValues(values)
    setData(workload)
  }, [workload, values])

  const handleCreateUpdateWorkload = async () => {
    const workloadBody = omit(data, ['chartProvider', 'chart', 'revision', 'values'])
    const chartMetadata = omit(data?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const path = workload?.path
    const body = { ...workloadBody, chartMetadata, url: workload?.url, path }
    let res
    if (workloadId) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadId, body })
      res = await updateWorkloadValues({ teamId, workloadId, body: { values: workloadValues } })
    } else {
      res = await createWorkload({ teamId, body })
      res = await updateWorkloadValues({ teamId, workloadId: res.data.id, body: { values: workloadValues } })
    }
    if (res.error) return
    history.push(`/teams/${teamId}/workloads`)
  }

  const schema = getWorkloadSchema()
  const uiSchema = getWorkloadUiSchema(user, teamId)

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        className={classes.header}
        sx={{
          position: 'absolute',
          top: calculateTop(scrollPosition, !!globalError),
          zIndex: 10,
        }}
      >
        <Box className={classes.imgHolder}>
          <img
            className={classes.img}
            src={icon}
            onError={({ currentTarget }) => {
              // eslint-disable-next-line no-param-reassign
              currentTarget.onerror = null // prevents looping
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = `${icon}`
            }}
            alt={`Logo for ${icon}`}
          />
        </Box>
        <Box>
          <Typography variant='h6'>{workload?.name ? `${workload.name} (${workload.path})` : workload.path}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            ml: 'auto',
          }}
        >
          <ButtonGroup>
            {tab === 1 && (
              <Button variant='contained' onClick={handleCreateUpdateWorkload}>
                Submit
              </Button>
            )}
            {workloadId && (
              <DeleteButton
                onDelete={() => deleteWorkload({ teamId, workloadId })}
                resourceName={workload?.name}
                resourceType='workload'
                data-cy='button-delete-workload'
              />
            )}
          </ButtonGroup>
        </Box>
      </Box>

      <AppBar position='relative' color='default' sx={{ borderRadius: '8px', mt: globalError ? '90px' : '66px' }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 1 }}>
          {tab !== 1 && (
            <Box
              sx={{
                position: 'absolute',
                width: '45px',
                left: '90px',
                bottom: '0px',
                transform: 'scale(1)',
                animation: 'pulse 2s infinite',
                boxShadow: '0 0 0 0 rgba(255, 0, 0, 1)',
              }}
            />
          )}
          <Tab href='#info' label='Info' value={hashMap.info} />
          <Tab href='#values' label={t('Values')} value={hashMap.values} />
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
                      <TableCell component='th' scope='row' align='right'>
                        <Chip label={t('Version:')} />
                      </TableCell>
                      <TableCell align='left'>{workload?.chartMetadata?.helmChartVersion}</TableCell>
                    </TableRow>

                    <TableRow key='description' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right'>
                        <Chip label={t('Description:')} />
                      </TableCell>
                      <TableCell align='left'>{workload?.chartMetadata?.helmChartDescription}</TableCell>
                    </TableRow>

                    <TableRow key='repo' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right'>
                        <Chip label={t('Repo:')} />
                      </TableCell>
                      <TableCell align='left'>
                        <Link href={workload?.url} target='_blank' rel='noopener'>
                          {workload?.url && cleanLink(workload.url as string)}
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={hashMap.values}>
        {workloadValues?.image && checkImageFields(workloadValues?.image) && (
          <InformationBanner message={checkImageFields(workloadValues?.image)} />
        )}
        <Form
          schema={schema}
          uiSchema={uiSchema}
          data={data}
          onChange={setData}
          disabled={!appsEnabled.argocd || !!workload?.id}
          resourceType='Workload'
          children
          hideHelp
          {...other}
        />

        {workload?.url && (
          <Tooltip title={`Chart values file for ${workload.path}`}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <Iconify icon='majesticons:open' />
              <Link
                sx={{ ml: '8px', fontSize: '14px' }}
                href={getValuesDocLink(workload.url as string, workload.path as string)}
                target='_blank'
                rel='noopener'
              >
                Chart values file
              </Link>
            </Box>
          </Tooltip>
        )}

        <WorkloadValues
          editable
          hideTitle
          workloadValues={workloadValues}
          setWorkloadValues={setWorkloadValues}
          showComments={!workload?.id}
        />
      </TabPanel>
    </Box>
  )
}
