/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Button, Link, Tooltip, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'
import { MigrateSecretsApiResponse, useGetAllSecretsQuery, useMigrateSecretsMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import { isEmpty } from 'lodash'
import SecretsMigrationModal from '../components/SecretsMigrationModal'

interface Params {
  teamId: string
  appId: string
}

export default function ({
  match: {
    params: { teamId, appId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [modalInfo, setModalInfo] = useState<MigrateSecretsApiResponse>({})
  const {
    user: { isAdmin },
    appsEnabled,
  } = useSession()
  const { data: secrets } = useGetAllSecretsQuery()
  const [migrateSecrets] = useMigrateSecretsMutation()
  const handleMigrateSecrets = async () => {
    const { data } = (await migrateSecrets({ body: { isAdmin } })) as { data: MigrateSecretsApiResponse }
    setOpen(true)
    setModalInfo(data)
  }
  let migrateSecretsTooltip = ''
  if (isEmpty(secrets)) migrateSecretsTooltip = 'There are no secrets to migrate!'
  else if (!appsEnabled['sealed-secrets']) migrateSecretsTooltip = 'Admin needs to enable the Sealed Secrets app first!'
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
            onClick={handleMigrateSecrets}
            disabled={!isAdmin || !appsEnabled['sealed-secrets'] || isEmpty(secrets)}
          >
            Migrate HashiCorp Vault Secrets to Sealed Secrets
          </Button>
        </span>
      </Tooltip>
      <SecretsMigrationModal open={open} handleClose={() => setOpen(false)} data={modalInfo} />
    </>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
