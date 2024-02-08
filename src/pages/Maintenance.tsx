/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Box, Link } from '@mui/material'

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
      <h1>Maintenance</h1>
      <h2>Actions:</h2>
      <Box sx={{ width: '600px' }}>
        <Link href='/api/v1/otomi/values?excludeSecrets=false' target='_blank' rel='noopener' title='Otomi Values'>
          Download Otomi values
        </Link>
      </Box>
      <Box sx={{ width: '600px' }}>
        <Link href='/api/v1/otomi/values' target='_blank' rel='noopener' title='Otomi Values'>
          Download Otomi values (secrets redacted)
        </Link>
      </Box>
    </>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
