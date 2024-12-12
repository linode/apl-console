import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import { KeyboardArrowRight, LocalOffer } from '@mui/icons-material'
import axios from 'axios'
import { findLast, isEmpty } from 'lodash'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetSettingsQuery } from 'redux/otomiApi'
import YAML from 'yaml'
import Modal from './Modal'
import { VersionInfo, parseUpdates } from '../utils/helpers'

const StyledAccordion = styled(Accordion)(() => ({
  backgroundColor: 'transparent',
  boxShadow: 'none !important',
  margin: '0px !important',
  '&:before': {
    display: 'none',
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
  padding: '0',
  '.MuiAccordionSummary-content': {
    margin: '0',
  },
  marginTop: '0px !important',
  display: 'inline-flex',
}))

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

  const latestCurrentUpdate = findLast(versionUpgrades?.currentVersionUpdates)?.version

  return (
    <Card sx={{ p: 3 }}>
      <Box>
        <Stack direction='row' justifyContent='flex-start' alignItems='center'>
          <Typography variant='h5' fontWeight='bold'>
            {isEmpty(versionUpgrades.currentVersionUpdates) ? 'No upgrades available!' : 'Upgrades Available!'}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            disabled={isEmpty(versionUpgrades.currentVersionUpdates)}
            onClick={() => handleUpgradeButton(latestCurrentUpdate)}
            sx={{ ml: 3, textTransform: 'none' }}
          >
            {isEmpty(latestCurrentUpdate) ? 'Running Latest' : `Upgrade to ${latestCurrentUpdate}`}
          </Button>
        </Stack>

        <Typography variant='body1' sx={{ fontSize: '14px', fontWeight: 'bold' }}>
          Current Version: {version}
        </Typography>
        {!isEmpty(versionUpgrades.currentVersionUpdates) && (
          <StyledAccordion disableGutters>
            <StyledAccordionSummary
              expandIcon={<KeyboardArrowRight />}
              sx={{
                '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <Typography variant='body2' sx={{ fontSize: '12px' }}>{`Here's what you've missed!`}</Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <StyledUpdateSection>
                {isEmpty(versionUpgrades.currentVersionUpdates) && (
                  <Box
                    sx={{
                      backgroundColor: '#3A3A3A',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <Typography sx={{ marginRight: '2rem' }}>
                      You are currently running the latest minor version of your major.
                    </Typography>
                  </Box>
                )}

                {versionUpgrades.currentVersionUpdates?.map((update) => (
                  <Box
                    key={update.version}
                    sx={{
                      backgroundColor: '#3A3A3A',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      padding: '0.5rem',
                      marginBottom: '0.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <IconButton
                      sx={{ paddingLeft: '0.5rem', borderRadius: 0, color: '#ffffff' }}
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
          </StyledAccordion>
        )}

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
            actionButtonText='Upgrade'
            cancelButtonText='Cancel Upgrade'
            actionButtonColor='primary'
            children={
              <Typography variant='h4' sx={{ marginRight: '2rem', textAlign: 'center' }}>
                Upgrade to version {upgradeVersion}?
              </Typography>
            }
          />
        )}
      </Box>
    </Card>
  )
}
