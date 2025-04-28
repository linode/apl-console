/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { Box, Button, Link, Tooltip, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'
import { useLocalStorage } from 'react-use'
import { useSession } from 'providers/Session'
import { useGetSettingsQuery } from 'redux/otomiApi'
import Section from 'components/Section'

const classes = {
  actionLink: {
    display: 'block',
    fontWeight: 400,
    fontSize: '14px',
  },
  actionButton: {
    mt: 1,
    px: 0,
    fontWeight: 400,
    fontSize: '14px',
    '&.MuiButton-root:hover': {
      bgcolor: 'transparent',
    },
  },
}

export default function (): React.ReactElement {
  const {
    settings: {
      otomi: { isPreInstalled },
    },
  } = useSession()
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const { data } = useGetSettingsQuery({ ids: ['obj'] })
  const isObjStorageConfigured = (): boolean => {
    const linode: any = data?.obj?.provider?.type === 'linode' ? data.obj.provider.linode : {}
    const { accessKeyId, secretAccessKey, region } = linode
    return Boolean(accessKeyId || secretAccessKey || region)
  }
  const handleShowObjWizard = () => {
    setShowObjWizard(true)
    window.location.reload()
  }

  const comp = (
    <Box sx={{ p: 2 }}>
      <HeaderTitle title='Maintenance' resourceType='maintenance' />

      <Section>
        <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
          Actions
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Link sx={classes.actionLink} href='/api/v1/otomi/values?excludeSecrets=false'>
            DOWNLOAD PLATFORM VALUES
          </Link>

          <Link sx={classes.actionLink} href='/api/v1/otomi/values?excludeSecrets=true'>
            DOWNLOAD PLATFORM VALUES (SECRETS REDACTED)
          </Link>
        </Box>

        {isPreInstalled && (
          <Tooltip title={isObjStorageConfigured() ? 'Object storage settings are already configured.' : ''}>
            <span>
              <Button
                variant='text'
                color='primary'
                sx={classes.actionButton}
                onClick={handleShowObjWizard}
                disabled={isObjStorageConfigured()}
              >
                Start Object Storage Wizard
              </Button>
            </span>
          </Tooltip>
        )}
      </Section>
    </Box>
  )

  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
