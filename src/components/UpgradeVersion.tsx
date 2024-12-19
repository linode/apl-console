import React, { useEffect, useState } from 'react'
import { AccordionDetails, Box, Button, Card, IconButton, Stack, Typography, styled, useTheme } from '@mui/material'
import { LocalOffer } from '@mui/icons-material'
import axios from 'axios'
import { findLast, isEmpty } from 'lodash'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import YAML from 'yaml'
import Modal from './Modal'
import { VersionInfo, parseUpdates } from '../utils/helpers'

const StyledAccordionDetails = styled(AccordionDetails)(() => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  marginTop: '0px',
  padding: 0,
  '&:before': {
    display: 'none',
  },
}))

const StyledUpdateSection = styled(Box)(() => ({
  marginTop: '20px',
}))

interface Props {
  version?: string
}

export default function UpgradesCard({ version }: Props): React.ReactElement | null {
  const { refetchSettings } = useSession()
  const theme = useTheme()
  const [data, setData] = useState<VersionInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [upgradeVersion, setUpgradeVersion] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { data: otomiSettings } = useGetSettingsQuery({ ids: ['otomi'] })
  const [edit] = useEditSettingsMutation()
  const baseUrl = 'https://github.com/linode/apl-core/releases/tag/'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/linode/apl-announcements/refs/heads/main/updates.yaml',
        )
        const parsedData = YAML.parse(response.data)
        setData(parsedData.updates)
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      }
    }

    fetchData()
  }, [])

  const handleUpgradeButton = (selectedVersion: string | undefined) => {
    if (!selectedVersion) return
    setUpgradeVersion(selectedVersion)
    setShowConfirmationModal(true)
  }

  const handleSubmit = () => {
    edit({
      settingId: 'otomi',
      body: {
        otomi: {
          ...otomiSettings.otomi,
          version: upgradeVersion,
        },
      },
    }).then(() => {
      refetchSettings()
      setUpgradeVersion('')
      setShowConfirmationModal(false)
    })
  }

  const versionUpgrades = parseUpdates(data, version)
  const currentMajorVersion = version.split('.')[0]

  const latestCurrentUpdate = findLast(versionUpgrades?.currentVersionUpdates)?.version

  return (
    <Card sx={{ p: 3, mb: 1 }}>
      <Box>
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
          <Typography variant='h5'>Available versions</Typography>

          <Typography variant='body1' sx={{ fontSize: '14px', fontWeight: 'bold' }}>
            Current version: v{version}
          </Typography>
        </Stack>

        <StyledAccordionDetails>
          <StyledUpdateSection>
            {isEmpty(versionUpgrades.currentVersionUpdates) && (
              <Box
                sx={{
                  backgroundColor: theme.palette.background.default,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Typography sx={{ marginRight: '2rem' }}>
                  There are no new updates for v{currentMajorVersion}
                </Typography>
              </Box>
            )}

            {versionUpgrades.currentVersionUpdates?.map((update) => (
              <Box
                key={update.version}
                sx={{
                  backgroundColor: theme.palette.background.default,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginBottom: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  sx={{ paddingLeft: '0.5rem', borderRadius: 0, color: theme.palette.text.primary }}
                  onClick={() => window.open(`${baseUrl}${update.version}`)}
                >
                  <LocalOffer />
                  <Typography sx={{ marginLeft: '0.5rem' }}>{update.version}</Typography>
                </IconButton>

                <Typography sx={{ marginLeft: '2rem', textAlign: 'left' }}>{update.message}</Typography>
              </Box>
            ))}
          </StyledUpdateSection>
        </StyledAccordionDetails>
        {!isEmpty(latestCurrentUpdate) && (
          <Stack direction='row' justifyContent='flex-end' alignItems='center'>
            <Button
              variant='contained'
              color='primary'
              disabled={isEmpty(versionUpgrades.currentVersionUpdates)}
              onClick={() => handleUpgradeButton(latestCurrentUpdate)}
              sx={{ ml: 3, textTransform: 'none' }}
            >
              {`Upgrade to ${latestCurrentUpdate}`}
            </Button>
          </Stack>
        )}
      </Box>

      {showConfirmationModal && (
        <Modal
          noHeader
          open={showConfirmationModal}
          handleClose={() => setShowConfirmationModal(false)}
          handleCancel={() => {
            setUpgradeVersion('')
            setShowConfirmationModal(false)
          }}
          handleAction={() => handleSubmit()}
          actionButtonText='Confirm'
          cancelButtonText='Cancel'
          actionButtonColor='primary'
          children={
            <>
              <Typography sx={{ marginRight: '2rem' }}>
                You are about to upgrade platform from {version} to {upgradeVersion}.
              </Typography>
              <Typography sx={{ marginRight: '2rem' }}>This action cannot be undone.</Typography>
              <Typography sx={{ mt: '1rem', mr: '2rem' }}>Please confirm to proceed or cancel to go back.</Typography>
            </>
          }
        />
      )}
    </Card>
  )
}
