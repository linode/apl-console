/* eslint-disable @typescript-eslint/no-floating-promises */
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { Box, Button, Link, Tooltip, Typography } from '@mui/material'
import HeaderTitle from 'components/HeaderTitle'
import { useLocalStorage } from 'react-use'
import { useSession } from 'providers/Session'
import { useGetSettingsQuery } from 'redux/otomiApi'

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
      <HeaderTitle title='Maintenance' resourceType='maintenance' altColor />
      <Typography variant='h6'>Actions</Typography>

      <Link sx={{ display: 'block' }} href='/api/v1/otomi/values?excludeSecrets=false'>
        Download APL values
      </Link>

      <Link sx={{ display: 'block', mt: '6px' }} href='/api/v1/otomi/values?excludeSecrets=true'>
        Download APL values (secrets redacted)
      </Link>

      {isPreInstalled && (
        <Tooltip title={isObjStorageConfigured() ? 'Object storage settings are already configured.' : ''}>
          <span>
            <Button
              variant='text'
              color='primary'
              sx={{
                px: 0,
                fontWeight: 500,
                fontSize: '16px',
                '&.MuiButton-root:hover': { bgcolor: 'transparent' },
              }}
              onClick={handleShowObjWizard}
              disabled={isObjStorageConfigured()}
            >
              Start Object Storage Wizard
            </Button>
          </span>
        </Tooltip>
      )}
    </Box>
  )
  // title is set in component as it knows more to put in the url (like tab chosen)
  return <PaperLayout comp={comp} loading={false} />
}
