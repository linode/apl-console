/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Button, Link, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'
import { useMigrateSecretsMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { user, oboTeamId } = useSession()
  const [migrateSecrets, { isLoading }] = useMigrateSecretsMutation()
  const handleMigrate = async () => {
    console.log('migrate')
    const res = await migrateSecrets({ body: { teamId: oboTeamId, isAdmin: user.isAdmin } })
    console.log('res', res)
  }
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

      <Typography variant='h6' mt={2}>
        Migrations
      </Typography>
      <Button
        variant='text'
        color='primary'
        sx={{
          px: 0,
          '&.MuiButton-root:hover': { bgcolor: 'transparent' },
          '&.MuiButton-root:active': { bgcolor: 'transparent', boxShadow: 'none' },
        }}
        onClick={handleMigrate}
      >
        Migrate HashiCorp Vault Secrets to Sealed Secrets
      </Button>
    </>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
