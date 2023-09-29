/* eslint-disable no-plusplus */
import { Grid } from '@mui/material'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetAppsApiResponse, GetTeamApiResponse } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { get } from 'lodash'
import { getAppData } from 'utils/data'
import AppCard from './AppCard'
import LoadingScreen from './LoadingScreen'
import TableToolbar from './TableToolbar'

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
// function sortArray(a, b) {
//   // Treat undefined as true
//   const aEnabled = a.enabled === undefined ? true : a.enabled
//   const bEnabled = b.enabled === undefined ? true : b.enabled

//   // Sort by "enabled" first, then by "id"
//   if (aEnabled === bEnabled) {
//     if (a.id < b.id) return -1
//     if (a.id > b.id) return 1
//     return 0
//   }

//   // Sort disabled apps first, then enabled apps
//   if (!aEnabled) return -1
//   return 1
// }

function sortArray(a, b) {
  // Treat undefined as true
  if (a.id < b.id) return -1
  if (a.id > b.id) return 1

  return 0
}

// ---- JSX -------------------------------------------------------------

interface Props {
  teamId: string
  apps: GetAppsApiResponse
  teamSettings: GetTeamApiResponse
  loading: boolean
  setAppState: CallableFunction
}

export default function ({ teamId, apps, teamSettings, loading, setAppState }: Props): React.ReactElement {
  const session = useSession()
  const { classes, cx } = useStyles()
  const [deps, setDeps] = useState(undefined)
  const [filterName, setFilterName] = useState('')
  const [orderBy, setOrderBy] = useState('enabled')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

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
  if (!apps || loading) return <LoadingScreen />
  // we visualize drag state for all app dependencies
  const isAdminApps = teamId === 'admin'
  const sorter = (a, b) => (a.id > b.id ? 1 : -1)
  const disabledByMonitoringStackApps = {
    alertmanager: true,
    prometheus: true,
    loki: true,
    grafana: true,
  }

  const disabledByProviderApps = {
    falco: true,
  }

  const dataFiltered = applySortFilter({
    tableData: apps,
    comparator: getComparator(order, orderBy),
    filterName,
  })
  // const staticApps = apps.filter((app) => app.enabled === undefined).sort(sorter)
  let enabledApps = apps.filter((app) => app.enabled !== false).sort(sorter)
  if (!(teamSettings?.monitoringStack?.enabled ?? true) && !isAdminApps)
    enabledApps = enabledApps.filter((app) => !disabledByMonitoringStackApps[app.id])
  let disabledApps = apps.filter((app) => app.enabled === false).sort(sorter)
  const provider = session.settings.cluster?.provider
  if (provider !== 'azure' && provider !== 'aws')
    disabledApps = disabledApps.filter((app) => !disabledByProviderApps[app.id])

  // const filteredApps = apps.filter((app) => app.id.toLowerCase().includes(searchTerm.toLowerCase()))

  const out = (items) =>
    items.map((item) => {
      const { enabled, externalUrl, id, logo, logoAlt, deps: coreDeps } = getAppData(session, teamId, item)
      return (
        <Grid item xs={12} sm={4} md={3} lg={2} key={id}>
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
          />
        </Grid>
      )
    })

  return (
    <div className={cx(classes.root)}>
      <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholderText='search apps' noPadding />
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {out(dataFiltered.sort(sortArray))}
      </Grid>
    </div>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: any
  comparator: (a: any, b: any) => number
  filterName: string
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) => item.id.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    )
  }

  return tableData
}
