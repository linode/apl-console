import { Grid } from '@material-ui/core'
import React from 'react'
import { useSession } from '../session-context'
import AppCard from './AppCard'

const contextPath = process.env.CONTEXT_PATH || ''

interface Props {
  teamId: string
}

export default ({ teamId }: Props): React.ReactElement => {
  const {
    core: {
      services: adminApps,
      teamConfig: { services: teamApps },
    },
    cluster,
    isMultitenant,
  }: any = useSession()
  const apps = (teamId === 'admin' ? adminApps : teamApps).filter((app) => !app.hide && app.name !== 'otomi')
  const sorter = (a, b) => (a.name > b.name ? 1 : -1)
  const enabledApps = apps.filter((app) => app.enabled !== false).sort(sorter)
  const disabledApps = apps.filter((app) => app.enabled === false).sort(sorter)
  const out = (items) => {
    return items.map(({ name, isShared, logo, domain, host, path, ownHost, enabled }) => {
      const logoName = logo ? logo.name : name

      const link = `https://${
        domain ||
        `${isShared || ownHost ? host || name : 'apps'}${
          !(isShared || teamId === 'admin' || !isMultitenant) ? `.team-${teamId}` : ''
        }.${cluster.domainSuffix}/${isShared || ownHost ? '' : `${host || name}/`}`
      }${(path || '').replace('#NS#', `team-${teamId}`)}`
      // eslint-disable-next-line consistent-return
      return (
        <Grid item xs={12} sm={6} lg={3} md={4} key={name}>
          <AppCard
            cluster={cluster}
            teamId={teamId}
            title={name}
            link={link}
            img={`${contextPath}/logos/${logoName}_logo.svg`}
            disabled={enabled === false}
            isMultitenant={isMultitenant}
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
