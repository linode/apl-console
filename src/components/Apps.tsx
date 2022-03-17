import { Grid, Typography } from '@mui/material'
import { useSession } from 'common/session-context'
import useApi from 'hooks/useApi'
import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { makeStyles } from 'tss-react/mui'
import { getAppData } from 'utils/data'
import AppCard from './AppCard'
import Loader from './Loader'

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  const m = p.mode
  return {
    root: {},
    disabled: {
      backgroundColor: m === 'light' ? p.action.disabledBackground : p.grey[800],
      '& .MuiTypography-root': {
        color: m === 'light' ? p.primary.light : p.grey[600],
      },
    },
    enabled: {
      '& .MuiTypography-root': {
        color: p.secondary.main,
      },
    },
    out: {
      backgroundColor: p.error.main,
    },
    in: {
      backgroundColor: p.success.main,
    },
  }
})

interface Props {
  teamId: string
}

export default function ({ teamId }: Props): React.ReactElement {
  const session = useSession()
  const { classes, cx } = useStyles()
  const [appState, setAppState] = useState([])
  const [appIds, appEnabled] = appState
  const [apps, loading, appsError]: any = useApi('getApps', !appIds, [teamId])
  const [editRes, editing, editError]: any = useApi('toggleApps', !!appIds, [
    teamId,
    { ids: appIds, enabled: appEnabled },
  ])
  const [deps, setDeps] = useState(undefined)
  const doDrop =
    (inOut) =>
    ({ name }) => {
      console.log(`drop ${inOut ? 'in' : 'out'} app: ${name}`)
      const { deps } = getAppData(session, teamId, name)
      setAppState([(deps || []).concat([name]), inOut])
      setDeps(undefined)
    }
  const [{ isIn }, dropIn] = useDrop(
    () => ({
      accept: 'card',
      drop: doDrop(true),
      collect: (monitor) => ({
        isIn: monitor.isOver(),
      }),
    }),
    [],
  )
  const [{ isOut }, dropOut] = useDrop(
    () => ({
      accept: 'card',
      drop: doDrop(false),
      collect: (monitor) => ({
        isOut: monitor.isOver(),
      }),
    }),
    [],
  )
  // END HOOKS
  if (!apps) return <Loader />
  // we visualize drag state for all app dependencies
  if (appIds && !editing) setTimeout(() => setAppState([]))
  const { cluster }: any = session
  const isAdminApps = teamId === 'admin'
  const sorter = (a, b) => (a.id > b.id ? 1 : -1)
  // const staticApps = apps.filter((app) => app.enabled === undefined).sort(sorter)
  const enabledApps = apps.filter((app) => app.enabled !== false).sort(sorter)
  const disabledApps = apps.filter((app) => app.enabled === false).sort(sorter)
  const out = (items) =>
    items.map((item) => {
      const { docUrl, enabled, externalUrl, id, logo, schema, deps: coreDeps } = getAppData(session, teamId, item)
      const isDragging = deps === undefined ? deps : deps.includes(id)
      return (
        <Grid item xs={12} sm={4} md={3} lg={2} key={id}>
          <AppCard
            cluster={cluster}
            teamId={teamId}
            id={id}
            title={schema.title}
            externalUrl={externalUrl}
            docUrl={docUrl}
            img={`/logos/${logo}`}
            enabled={enabled}
            hideConfButton={!isAdminApps || !schema.properties?.values}
            deps={coreDeps}
            setDeps={setDeps}
            isDragging={isDragging}
          />
        </Grid>
      )
    })
  return (
    <>
      <div className={cx(classes.root, classes.disabled, isOut && classes.out)} ref={dropOut}>
        <Typography sx={{ padding: 2 }}>Disabled apps (drop below to enable)</Typography>
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {out(disabledApps)}
        </Grid>
      </div>
      <div ref={dropIn}>
        <div className={cx(classes.root, classes.enabled, isIn && classes.in)}>
          <Typography sx={{ padding: 2 }}>Enabled apps (drop above to disable)</Typography>
          <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
            {out(enabledApps)}
          </Grid>
        </div>
      </div>
    </>
  )
}
