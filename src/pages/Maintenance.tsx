/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { Box, Link, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'

export default function (): React.ReactElement {
  const comp = (
    <Box sx={{ p: 2 }}>
      <HeaderTitle title='Maintenance' resourceType='maintenance' altColor />
      <Typography variant='h6'>Actions</Typography>

      <Link sx={{ display: 'block' }} href='/api/v1/otomi/values?excludeSecrets=false'>
        Download APL values
      </Link>

      <Link sx={{ display: 'block' }} href='/api/v1/otomi/values?excludeSecrets=true'>
        Download APL values (secrets redacted)
      </Link>
    </Box>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
