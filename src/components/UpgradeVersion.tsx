import React, { useEffect, useState } from 'react'
import { AccordionDetails, Box, Button, Card, Link, Stack, Typography, styled, useTheme } from '@mui/material'
import axios from 'axios'
import { isEmpty } from 'lodash'
import { useSession } from 'providers/Session'
import { useEditSettingsMutation, useGetK8SVersionQuery, useGetSettingsQuery } from 'redux/otomiApi'
import YAML from 'yaml'
import { WarningIconRounded } from 'theme/overrides/CustomIcons'
import DashboardPopover from './DashboardPopover'
import Modal from './Modal'
import {
  VersionInfo,
  checkAgainstK8sVersion,
  latestApplicableUpdateVersion,
  parseAllUpdates,
  selectDisplayUpdates,
} from '../utils/helpers'

const StyledVersionText = styled(Typography)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  marginLeft: '0.5rem',
  color: disabled ? theme.palette.dashboard?.textDisabled || theme.palette.text.disabled : theme.palette.primary.main,
  textDecoration: 'underline',
  fontWeight: 500,
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

const StyledUpdateRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  backgroundColor: disabled
    ? theme.palette.dashboard?.rowDisabled || theme.palette.action.disabledBackground
    : theme.palette.background.default,
  display: 'flex',
  height: '2.1rem',
  alignItems: 'center',
  marginBottom: '0.5rem',
}))

const StyledUpdateMessage = styled(Typography)<{ disabled?: boolean }>(({ theme, disabled }) => ({
  marginLeft: '2rem',
  textAlign: 'left',
  color: disabled ? theme.palette.dashboard?.textDisabled || theme.palette.text.disabled : theme.palette.text.primary,
  maxWidth: '80%',
  maxHeight: '2.2rem',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
}))

const StyledEmptyUpdateRow = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'flex-start',
  padding: '0.5rem',
  marginBottom: '0.5rem',
}))

const StyledVersionButton = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<{ disabled?: boolean }>(({ theme, disabled }) => ({
  paddingLeft: '0.5rem',
  borderRadius: 0,
  color: disabled ? theme.palette.dashboard?.textDisabled || theme.palette.text.disabled : theme.palette.primary.main,
  cursor: 'pointer',
  '&:hover .version-link': {
    textDecoration: 'underline',
    color: theme.palette.primary.dark,
  },
}))

const StyledWarningIconBox = styled(Box)(({ theme }) => ({
  height: '17px',
  width: '17px',
  borderRadius: 0,
  color: theme.palette.text.primary,
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  paddingRight: '1.6rem',
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
  const [warningAnchorEl, setWarningAnchorEl] = useState<null | HTMLElement>(null)
  const [hoveredUpdate, setHoveredUpdate] = useState<VersionInfo | null>(null)
  const { data: otomiSettings } = useGetSettingsQuery({ ids: ['otomi'] })
  const [edit] = useEditSettingsMutation()
  const baseUrl = 'https://github.com/linode/apl-core/releases/tag/'
  const { data: k8sVersion } = useGetK8SVersionQuery()

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

  const kubernetesVersion = k8sVersion || ''
  const versionUpgrades = parseAllUpdates(data, kubernetesVersion)
  const displayUpdates = selectDisplayUpdates(versionUpgrades, version)
  const currentMajorVersion = version.split('.')[0]
  const currentSupportedK8sVersions = versionUpgrades?.find(
    (update) => update.version === version,
  )?.supported_k8s_versions

  const latestCurrentUpdate = latestApplicableUpdateVersion(displayUpdates, kubernetesVersion)?.version

  return (
    <Card sx={{ p: 3, mb: 1 }}>
      <Box>
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center'>
            <Typography variant='h5'>Available versions</Typography>
            <Box sx={{ width: 24 }} />
            <Typography variant='body1' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
              Current version: {version}
            </Typography>
          </Box>
          <Typography variant='body1' sx={{ fontSize: '13px', fontWeight: 'bold' }}>
            Supported kubernetes versions: {currentSupportedK8sVersions?.join(', ') || 'Unknown'}
          </Typography>
        </Stack>

        <StyledAccordionDetails>
          <StyledUpdateSection>
            {isEmpty(displayUpdates) && (
              <StyledEmptyUpdateRow>
                <Typography sx={{ marginRight: '2rem' }}>There are no new updates for {currentMajorVersion}</Typography>
              </StyledEmptyUpdateRow>
            )}

            {displayUpdates?.map((update) => (
              <StyledUpdateRow key={update.version} disabled={!checkAgainstK8sVersion(update, kubernetesVersion)}>
                <StyledVersionButton
                  disabled={!checkAgainstK8sVersion(update, kubernetesVersion)}
                  onClick={() => window.open(`${baseUrl}${update.version}`)}
                >
                  <StyledVersionText
                    className='version-link'
                    disabled={!checkAgainstK8sVersion(update, kubernetesVersion)}
                  >
                    {update.version}
                  </StyledVersionText>
                </StyledVersionButton>
                <StyledUpdateMessage disabled={!checkAgainstK8sVersion(update, kubernetesVersion)}>
                  {update.message}
                </StyledUpdateMessage>
                {!checkAgainstK8sVersion(update, kubernetesVersion) && (
                  <>
                    <StyledWarningIconBox
                      onMouseEnter={(e) => {
                        setWarningAnchorEl(e.currentTarget)
                        setHoveredUpdate(update)
                      }}
                      onMouseLeave={() => {
                        setWarningAnchorEl(null)
                      }}
                    >
                      <WarningIconRounded sx={{ width: '17px', height: '17px', color: '#FECB34' }} />
                    </StyledWarningIconBox>
                    <DashboardPopover
                      open={Boolean(warningAnchorEl)}
                      anchorEl={warningAnchorEl}
                      onClose={() => {
                        setWarningAnchorEl(null)
                        setHoveredUpdate(null)
                      }}
                      title='Incompatible kubernetes version'
                      description={`The kubernetes version of your cluster is not supported with this version of App Platform. Please upgrade your cluster kubernetes version to ${hoveredUpdate?.supported_k8s_versions?.join(
                        ', ',
                      )}`}
                    />
                  </>
                )}
              </StyledUpdateRow>
            ))}
          </StyledUpdateSection>
        </StyledAccordionDetails>
        {!isEmpty(latestCurrentUpdate) && (
          <Stack direction='row' justifyContent='flex-end' alignItems='center'>
            <Button
              variant='contained'
              color='primary'
              disabled={isEmpty(displayUpdates)}
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
                You are about to upgrade App Platform from {version} to {upgradeVersion}.
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
