/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Link, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const comp = (
    <>
      <HeaderTitle title='Maintenance' resourceType='maintenance' />
      <Typography variant='h6'>Actions</Typography>

      <Link sx={{ display: 'block' }} href='/api/v1/otomi/values?excludeSecrets=false'>
        Download Otomi values
      </Link>

      <Link sx={{ display: 'block' }} href='/api/v1/otomi/values?excludeSecrets=true'>
        Download Otomi values (secrets redacted)
      </Link>
    </>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
