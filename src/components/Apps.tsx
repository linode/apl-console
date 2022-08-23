import { Grid, Typography } from '@mui/material'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { GetAppsApiResponse } from 'redux/otomiApi'
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
  apps: GetAppsApiResponse
  loading: boolean
  setAppState: CallableFunction
}

export default function ({ teamId, apps, loading, setAppState }: Props): React.ReactElement {
  const session = useSession()
  const { classes, cx } = useStyles()
  const [deps, setDeps] = useState(undefined)
  const doDrop =
    (inOut) =>
    ({ name }) => {
      console.log(`drop ${inOut ? 'in' : 'out'} app: ${name}`)
      const { deps } = getAppData(session, teamId, name)
      // we only allow turning on
      if (!inOut || session.appsEnabled[name]) return
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
  if (!apps || loading) return <Loader />
  // we visualize drag state for all app dependencies
  const isAdminApps = teamId === 'admin'
  const sorter = (a, b) => (a.id > b.id ? 1 : -1)
  // const staticApps = apps.filter((app) => app.enabled === undefined).sort(sorter)
  const enabledApps = apps.filter((app) => app.enabled !== false).sort(sorter)
  const disabledApps = apps.filter((app) => app.enabled === false).sort(sorter)
  const out = (items) =>
    items.map((item) => {
      const { enabled, externalUrl, id, logo, logoAlt, appInfo, deps: coreDeps } = getAppData(session, teamId, item)
      const isDragging = deps === undefined ? deps : deps.includes(id)
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
            isDragging={isDragging}
            setDeps={setDeps}
            teamId={teamId}
            title={appInfo.title}
            setAppState={setAppState}
          />
        </Grid>
      )
    })
  return isAdminApps ? (
    <>
      <div className={cx(classes.root, classes.disabled, isOut && classes.out)}>
        <Typography sx={{ padding: 2 }}>Disabled apps (drop below to enable)</Typography>
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {out(disabledApps)}
        </Grid>
      </div>
      <div className={cx(classes.root, classes.enabled, isIn && classes.in)} ref={dropIn}>
        <Typography sx={{ padding: 2 }}>Enabled apps</Typography>
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {out(enabledApps)}
        </Grid>
      </div>
    </>
  ) : (
    <div className={cx(classes.root, classes.enabled, isIn && classes.in)}>
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {out(enabledApps)}
      </Grid>
    </div>
  )
}
