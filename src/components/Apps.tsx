import { Grid } from '@material-ui/core'
import React from 'react'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'
import AppCard from './AppCard'

const publicUrl = process.env.PUBLIC_URL

interface Props {
  teamId: string
}

export default ({ teamId }: Props): any => {
  const {
    core: {
      services: adminApps,
      teamConfig: { services: teamApps },
    },
    currentClusterId,
    clusters,
  } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })
  const apps = teamId === 'admin' ? adminApps : teamApps
  return (
    <Grid container direction='row' alignItems='center' spacing={2}>
      {apps
        .filter(app => !app.hide && app.name !== 'otomi')
        .map(({ name, isShared, logo, domain, host, path, ownHost }) => {
          const teamPrefix = 'team-' // @todo: get from values later
          const logoName = logo ? logo.name : name
          const link = `https://${domain ||
            `${ownHost ? host || name : 'apps'}${!isShared ? `.${teamPrefix}${teamId}` : ''}.${cluster.domain}/${
              ownHost ? '' : `${host || name}/`
            }`}${(path || '').replace('#NS#', `team-${teamId}`)}`
          // eslint-disable-next-line consistent-return
          return (
            <Grid item xs={12} sm={6} lg={3} md={4} key={name}>
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
