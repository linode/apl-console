import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'
import AppCard from './AppCard'

const publicUrl = process.env.PUBLIC_URL

const useStyles = makeStyles(theme => ({
  root: {},
}))

export default (): any => {
  const {
    core: {
      services: adminApps,
      teamConfig: { services: teamApps },
    },
    currentClusterId,
    clusters,
    user: { teamId, isAdmin },
  } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const apps = isAdmin ? adminApps : teamApps
  return (
    <Grid container direction='row' justify='center' alignItems='center' spacing={2}>
      {apps
        .filter(app => !app.hide)
        .map(({ hide, name, logo, domain, host, path }) => {
          const teamPrefix = 'team-' // @todo: get from values later
          const logoName = logo ? logo.name : name
          const link = `https://${domain || `${host || name}.${teamPrefix}${teamId}.${cluster.domain}`}${(
            path || ''
          ).replace('#NS#', `team=${teamId}`)}`
          // eslint-disable-next-line consistent-return
          return (
            <Grid item xs={6} sm={3} key={logoName}>
              <AppCard
                cluster={cluster}
                teamId={teamId}
                title={name}
                link={link}
                img={`${publicUrl}/logos/${logoName}_logo.svg`}
              />
            </Grid>
          )
        })}
    </Grid>
  )
}
