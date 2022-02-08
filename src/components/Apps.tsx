import { Grid } from '@material-ui/core'
import React from 'react'
import { useSession } from '../session-context'
import { getAppData, getApps } from '../utils/data'
import AppCard from './AppCard'

const contextPath = process.env.CONTEXT_PATH || ''

interface Props {
  teamId: string
}

export default ({ teamId }: Props): React.ReactElement => {
  const session = useSession()
  const {
    core: { adminApps, teamApps },
    cluster,
  }: any = session
  const isAdminApps = teamId === 'admin'
  const apps = getApps(adminApps, teamApps, teamId)
  const sorter = (a, b) => (a.name > b.name ? 1 : -1)
  const enabledApps = apps.filter((app) => app.enabled !== false).sort(sorter)
  const disabledApps = apps.filter((app) => app.enabled === false).sort(sorter)
  const out = (items) => {
    return items.map((item) => {
      const name = item?.name
      const { id, schema, link, logo, enabled, docUrl } = getAppData(session, teamId, item)
      return (
        <Grid item xs={12} sm={6} lg={3} md={4} key={name}>
          <AppCard
            cluster={cluster}
            teamId={teamId}
            id={id}
            title={schema.title}
            link={link}
            docUrl={docUrl}
            img={`${contextPath}/logos/${logo}`}
            disabled={enabled === false}
            hideConfButton={!isAdminApps || !schema.properties?.values}
          />
        </Grid>
      )
    })
  }

  return (
    <Grid container direction='row' alignItems='center' spacing={2} data-cy='grid-apps'>
      {out(enabledApps)}
      {out(disabledApps)}
    </Grid>
  )
}
