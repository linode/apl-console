/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Button, Link, Tooltip, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'
import { MigrateSecretsApiResponse, useMigrateSecretsMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import snack from 'utils/snack'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const {
    user: { isAdmin },
    appsEnabled,
  } = useSession()
  const [migrateSecrets] = useMigrateSecretsMutation()
  const handleMigrate = async () => {
    await migrateSecrets({ body: { isAdmin } }).then(({ data }: { data: MigrateSecretsApiResponse }) => {
      snack[data.status](<Typography>{data.message}</Typography>)
    })
  }
  let migrateSecretsTooltip = ''
  if (!appsEnabled['sealed-secrets']) migrateSecretsTooltip = 'Admin needs to enable the Sealed Secrets app first!'
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
      <Tooltip title={migrateSecretsTooltip}>
        <span>
          <Button
            variant='text'
            color='primary'
            sx={{
              px: 0,
              '&.MuiButton-root:hover': { bgcolor: 'transparent' },
            }}
            onClick={handleMigrate}
            disabled={!isAdmin || !appsEnabled['sealed-secrets']}
          >
            Migrate HashiCorp Vault Secrets to Sealed Secrets
          </Button>
        </span>
      </Tooltip>
    </>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
