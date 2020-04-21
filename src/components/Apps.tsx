import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import { find } from 'lodash/collection'
import { useSession } from '../session-context'
import AppCard from './AppCard'

const useStyles = makeStyles(theme => ({
  root: {},
}))

export default (): any => {
  const {
    core: { services },
    currentClusterId,
    clusters,
    user: { teamId },
  } = useSession()
  const [cloud, clusterName] = currentClusterId.split('/')
  const cluster = find(clusters, { cloud, cluster: clusterName })

  return (
    <Grid container direction='row' justify='center' alignItems='center' spacing={2}>
      {services.map(({ hide, name, logo }) => {
        if (hide) return
        const logoName = logo ? logo.name : name
        // eslint-disable-next-line consistent-return
        return (
          <Grid item xs={6} sm={3} key={logoName}>
            <AppCard
              cluster={cluster}
              teamId={teamId}
              title={name}
              img={`${process.env.PUBLIC_URL}/logos/${logoName}_logo.svg`}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}
