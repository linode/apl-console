/* eslint-disable react/button-has-type */
import {
  AppBar,
  Box,
  Button,
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
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { makeStyles } from 'tss-react/mui'
import { cleanLink } from 'utils/data'
import Form from './rjsf/Form'
import WorkloadValues from './WorkloadValues'
import DeleteButton from './DeleteButton'
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

export const getWorkloadSchema = (): any => {
  return cloneDeep(getSpec().components.schemas.Workload)
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    'ui:description': ' ',
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
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
  createWorkload: any
  updateWorkload: any
  updateWorkloadValues: any
  deleteWorkload: any
  item?: any
}

export default function ({
  teamId,
  workload,
  workloadId,
  createWorkload,
  updateWorkload,
  updateWorkloadValues,
  deleteWorkload,
  item,
  ...other
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

  const logo = 'otomi_logo.svg'
  const logoAlt = 'otomi_logo.svg'

  const defTab = hashMap[hash] ?? hashMap.info
  const [tab, setTab] = useState(defTab)
  const handleTabChange = (event, tab) => {
    setTab(tab)
  }

  const history = useHistory()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { appsEnabled, user } = useSession()
  const [data, setData] = useState<any>(workload)
  const [workloadValues, setWorkloadValues] = useState<any>(item?.values)

  useEffect(() => {
    if (!item) return
    setWorkloadValues(item?.values)
    setData((prev) => ({
      ...prev,
      path: item?.name,
      chartMetadata: {
        ...prev?.chartMetadata,
        helmChartVersion: item?.chartVersion,
        helmChartDescription: item?.chartDescription,
      },
    }))
  }, [item])

  const send = true

  const handleCreateUpdateWorkload = async () => {
    const workloadBody = omit(data, ['chartProvider', 'chart', 'revision'])
    const chartMetadata = omit(data?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const body = { ...workloadBody, chartMetadata, url: item?.url }
    let res
    if (send) {
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
  }

  const helmChart: string = item?.name || ''
  const schema = getWorkloadSchema()
  const uiSchema = getWorkloadUiSchema(user, teamId)

  return (
    <Box sx={{ width: '100%' }}>
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
            alt={`Logo for ${logo} app`}
          />
        </Box>
        <Box className={classes.headerText}>
          <Typography className={classes.headerText} variant='h6'>
            {item.name}
          </Typography>
        </Box>
      </Box>

      <AppBar position='relative' color='default' sx={{ borderRadius: '8px' }}>
        <Tabs value={tab} onChange={handleTabChange} sx={{ ml: 1 }}>
          <Tab href='#info' label='Info' value={hashMap.info} />
          <Tab href='#rawvalues' label={t('Values')} value={hashMap.rawvalues} />
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
                      <TableCell align='left'>{item?.chartVersion}</TableCell>
                    </TableRow>

                    <TableRow key='description' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Description:')} />
                      </TableCell>
                      <TableCell align='left'>{item?.chartDescription}</TableCell>
                    </TableRow>

                    <TableRow key='repo' className={classes.tableRow}>
                      <TableCell component='th' scope='row' align='right' className={classes.tableHead}>
                        <Chip label={t('Repo:')} />
                      </TableCell>
                      <TableCell align='left'>
                        <Link href={item?.url} target='_blank' rel='noopener'>
                          {item?.url && cleanLink(item.url as string)}
                        </Link>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.content}>
              <Button variant='contained' href='#rawvalues' onClick={() => handleTabChange(undefined, 3)}>
                Start
              </Button>
            </Box>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tab} index={hashMap.rawvalues}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {workloadId && (
            <DeleteButton
              onDelete={() => deleteWorkload({ teamId, workloadId })}
              resourceName={workload?.name}
              resourceType='workload'
              data-cy='button-delete-workload'
            />
          )}
        </Box>

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

        <WorkloadValues
          editable
          hideTitle
          workloadValues={workloadValues}
          setWorkloadValues={setWorkloadValues}
          helmChart={helmChart}
        />

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button variant='contained' onClick={handleCreateUpdateWorkload}>
            Submit
          </Button>
        </Box>
      </TabPanel>
    </Box>
  )
}
