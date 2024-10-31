/* eslint-disable no-plusplus */
import { Box, Grid } from '@mui/material'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetAppsApiResponse, GetTeamApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { get } from 'lodash'
import { getAppData } from 'utils/data'
import AppCard from './AppCard'
import TableToolbar from './TableToolbar'
import Modal from './Modal'
import DeprecatedModalInfo from './DeprecatedModalInfo'

// -- Styles -------------------------------------------------------------

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  const m = p.mode

  // Disabled app styling:
  // filter: grayscale(1);
  // opacity: 0.5;
  // background-color: #eeeeee;
  return {
    root: {
      color: theme.palette.text.secondary,
      fontWeight: '200',
      marginTop: '5px',
    },
    searchbar: {
      backgroundColor: '#444444',
    },
    // enabled: {
    //   '& .MuiTypography-root': {
    //     color: '#585656',
    //     fontWeight: '200',
    //   },
    // },
    out: {
      backgroundColor: p.error.main,
    },
    in: {
      backgroundColor: p.success.main,
    },
  }
})

// -- Sort algorithms -----------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (get(b, orderBy) < get(a, orderBy)) return -1

  if (get(b, orderBy) > get(a, orderBy)) return 1

  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}
function sortArray(a, b) {
  // Treat undefined as true
  const aEnabled = a.enabled === undefined ? true : a.enabled
  const bEnabled = b.enabled === undefined ? true : b.enabled

  // Sort by "enabled" first, then by "id"
  if (aEnabled === bEnabled) {
    if (a.id < b.id) return -1
    if (a.id > b.id) return 1
    return 0
  }

  // Sort enabled apps first, then disabled apps
  if (aEnabled) return -1
  return 1
}

// function sortArray(a, b) {
//   // Treat undefined as true
//   if (a.id < b.id) return -1
//   if (a.id > b.id) return 1

//   return 0
// }

function getDeprecatedApps(apps, session, teamId) {
  return apps
    ?.map((app) => {
      const { id, isDeprecated, deprecationInfo, externalUrl, replacementUrl } = getAppData(session, teamId, app)
      if (isDeprecated) return { id, deprecationInfo, externalUrl, replacementUrl }
      return null
    })
    ?.filter((app) => app !== null)
}

// ---- JSX -------------------------------------------------------------

interface Props {
  teamId: string
  apps: GetAppsApiResponse
  teamSettings: GetTeamApiResponse
  setAppState: CallableFunction
}

export default function Apps({ teamId, apps, teamSettings, setAppState }: Props): React.ReactElement {
  const session = useSession()
  const { classes, cx } = useStyles()
  const [deps, setDeps] = useState(undefined)
  const [filterName, setFilterName] = useState('')
  const [orderBy, setOrderBy] = useState('enabled')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [openModal, setOpenModal] = useState('')

  const toggleApp = (name: string) => {
    const { deps, appInfo } = getAppData(session, teamId, name)
    // we only allow turning on
    setAppState([(appInfo.dependencies || []).concat([name])])
    setDeps(undefined)
  }

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    // setPage(0)
  }

  // END HOOKS
  // we visualize drag state for all app dependencies
  const isAdmin = teamId === 'admin'
  const dataFiltered = applySortFilter({
    tableData: apps,
    comparator: getComparator(order, orderBy),
    filterName,
    managedMonitoringApps: teamSettings?.managedMonitoring || undefined,
    isAdmin,
  })

  const deprecatedApps = getDeprecatedApps(dataFiltered, session, teamId)

  // const filteredApps = apps.filter((app) => app.id.toLowerCase().includes(searchTerm.toLowerCase()))

  const out = (items) =>
    items?.map((item) => {
      const {
        enabled,
        externalUrl,
        id,
        logo,
        logoAlt,
        deps: coreDeps,
        isDeprecated,
        isBeta,
      } = getAppData(session, teamId, item)
      return (
        <Grid item xs={12} sm={6} md={4} lg={4} key={id}>
          <AppCard
            deps={coreDeps}
            enabled={enabled !== false}
            isCore={enabled === undefined}
            externalUrl={externalUrl}
            id={id}
            img={`/logos/${logo}`}
            imgAlt={`/logos/${logoAlt}`}
            setDeps={setDeps}
            teamId={teamId}
            title={id}
            setAppState={setAppState}
            hostedByOtomi={item.enabled === undefined}
            toggleApp={() => toggleApp(id)}
            isDeprecated={isDeprecated}
            isBeta={isBeta}
            openModal={() => setOpenModal(id)}
          />
        </Grid>
      )
    })

  const deprecatedAppModals = () => {
    return deprecatedApps?.map((app) => {
      const handleCancel = () => {
        setOpenModal('')
        window.open(app.externalUrl, '_blank')
      }

      const handleAction = () => {
        setOpenModal('')
        window.open(app.replacementUrl, '_blank')
      }
      return (
        <div key={`deprecated-${app.id}-modal`}>
          <Modal
            noHeader
            children={<DeprecatedModalInfo deprecatedApp={app} />}
            open={openModal === app.id}
            handleClose={() => setOpenModal('')}
            handleCancel={handleCancel}
            cancelButtonText='I understand!'
            handleAction={handleAction}
            actionButtonText={`Go to ${app.deprecationInfo.replacement}`}
          />
        </div>
      )
    })
  }

  return (
    <Box p={5} className={cx(classes.root)}>
      <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholderText='search apps' noPadding />
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {out(dataFiltered?.sort(sortArray))}
      </Grid>
      {deprecatedAppModals()}
    </Box>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  managedMonitoringApps,
  isAdmin,
}: {
  tableData: any
  comparator: (a: any, b: any) => number
  filterName: string
  managedMonitoringApps: any
  isAdmin: boolean
}) {
  const stabilizedThis = tableData?.map((el, index) => [el, index] as const)

  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis?.map((el) => el[0])

  if (filterName) {
    tableData = tableData?.filter(
      (item: Record<string, any>) => item.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    )
  }

  if (managedMonitoringApps)
    tableData = tableData?.filter((item: Record<string, any>) => managedMonitoringApps[item.id.toLowerCase()] !== false)

  if (!isAdmin) tableData = tableData?.filter((item: Record<string, any>) => item.enabled !== false)

  return tableData
}
