import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonPropsColorOverrides,
  Checkbox,
  FormControlLabel,
  Modal,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
// eslint-disable-next-line import/no-unresolved
import { OverridableStringUnion } from '@mui/types'
import { useGetHelmChartContentQuery } from 'redux/otomiApi'
import { isEmpty } from 'lodash'
import { useSession } from 'providers/Session'
import DefaultLogo from '../assets/akamai-logo-rgb-waveOnly'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '90%',
  overflowY: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
  // Hide scrollbar
  '-ms-overflow-style': 'none' /* Internet Explorer 10+ */,
  'scrollbar-width': 'none' /* Firefox */,
  '&::-webkit-scrollbar': {
    display: 'none' /* Safari and Chrome */,
  },
}))

const ModalHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '20px',
  paddingLeft: '32px',
  paddingTop: '32px',
  paddingRight: '32px',
  borderBottom: '1px dashed rgba(145, 158, 171, 0.24)',
})

const ModalContent = styled('div')({
  padding: '32px',
})

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
})

// helper functions -----------------------------------------------------
export const checkDirectoryName = (directoryName: string, chartDirectories: string[]) => {
  if (!directoryName) return 'Directory name is required.'
  if (chartDirectories.includes(directoryName.toLowerCase())) return 'Directory name already exists.'
  // Regex to validate directory names by checking:
  // 1. Names consisting **only** of dots (`.`) → Invalid (e.g., "..", "...").
  // 2. Presence of special characters: `\ / : * ? " < > | # % & { } $ ! ` ~` or whitespace → Invalid.
  // 3. Names starting (`^-`) or ending (`-$`) with a hyphen → Invalid.
  const invalidDirNamePattern = /[\\/:*?"<>|#%&{}$!`~\s]|^\.+$|^-|-$/
  if (invalidDirNamePattern.test(directoryName))
    return 'Invalid directory name. Avoid spaces, special characters or leading, trailing dots and dashes.'
  return ''
}

// interface and component -----------------------------------------------
interface Props {
  title?: string
  noHeader?: boolean
  open: boolean
  handleClose: () => void
  handleCancel?: () => void
  cancelButtonText?: string
  handleAction?: (values: NewChartValues) => void
  actionButtonText?: string
  actionButtonColor?: OverridableStringUnion<
    'inherit' | 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
  actionButtonEndIcon?: React.ReactElement
  actionButtonFrontIcon?: React.ReactElement
  chartDirectories: string[]
}

interface NewChartValues {
  gitRepositoryUrl: string
  chartTargetDirName: string
  chartIcon?: string
  allowTeams: boolean
}

export default function NewChartModal({
  title,
  noHeader,
  open,
  handleClose,
  handleCancel,
  cancelButtonText,
  handleAction,
  actionButtonText,
  actionButtonColor,
  actionButtonEndIcon,
  actionButtonFrontIcon,
  chartDirectories,
}: Props) {
  const {
    settings: { cluster },
  } = useSession()
  const [helmChartUrl, setHelmChartUrl] = useState('')
  const [gitRepositoryUrl, setGitRepositoryUrl] = useState('')
  const [chartName, setChartName] = useState('')
  const [chartDescription, setChartDescription] = useState('')
  const [chartAppVersion, setChartAppVersion] = useState('')
  const [chartVersion, setChartVersion] = useState('')
  const [chartIcon, setChartIcon] = useState('')
  const [chartTargetDirName, setChartTargetDirName] = useState('')
  const [allowTeams, setAllowTeams] = useState(true)
  // Indicates that Get details passed.
  const [connectionTested, setConnectionTested] = useState(false)
  // Error state for the URL input.
  const [urlError, setUrlError] = useState<string>('')
  // Loading state for the Add Chart button.
  const [isLoading, setIsLoading] = useState(false)

  const {
    data: helmChartData,
    isLoading: isLoadingHelmChartContent,
    isFetching: isFetchingHelmChartContent,
  } = useGetHelmChartContentQuery({ url: helmChartUrl }, { skip: !helmChartUrl })

  useEffect(() => {
    if (helmChartData?.error) {
      const { error } = helmChartData as { error: string }
      setConnectionTested(false)
      setUrlError(error)
    } else {
      setConnectionTested(true)
      setUrlError(null)
    }
    if (!isEmpty(helmChartData?.values)) {
      const { values } = helmChartData as {
        values: { name: string; description: string; version: string; appVersion: string; icon: string }
      }
      setChartName(values.name)
      setChartDescription(values.description)
      setChartVersion(values.version)
      setChartAppVersion(values.appVersion)
      setChartIcon(values.icon || '')
      setChartTargetDirName(values.name)
      setConnectionTested(true)
    } else setConnectionTested(false)
  }, [helmChartData])

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const repoUrl = e.target.value
    setHelmChartUrl('')
    setGitRepositoryUrl(repoUrl)
    setConnectionTested(false)
    setUrlError(null)
  }

  const handleSubmit = () => {
    setIsLoading(true)
    handleAction({
      gitRepositoryUrl: helmChartUrl,
      chartTargetDirName,
      chartIcon,
      allowTeams,
    })
  }

  // Form is valid when connection is tested, required fields are filled, and no error exists.
  const isFormValid =
    connectionTested &&
    chartName?.trim() !== '' &&
    chartAppVersion?.trim() !== '' &&
    chartVersion?.trim() !== '' &&
    gitRepositoryUrl?.trim() !== '' &&
    !checkDirectoryName(chartTargetDirName, chartDirectories) &&
    !urlError

  // Temp solution to style disabled state, cannot be done with styled components.
  const disabledSx = {
    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: '#58585833',
    },
    '& .MuiFormLabel-root.Mui-disabled': {
      color: '#6b6b6b !important',
    },
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        {!noHeader && (
          <ModalHeader>
            <Typography variant='h5'>{title}</Typography>
          </ModalHeader>
        )}
        <ModalContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Helper text */}
            <Typography variant='body2' color='textSecondary'>
              Provide a git repository URL pointing to a Chart.yaml file.
            </Typography>
            {/* Row for the GitHub URL input and Get details button */}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <TextField
                sx={{ width: '480px' }}
                placeholder='Git Repository URL'
                label='Git Repository URL'
                value={gitRepositoryUrl}
                onChange={handleUrlChange}
                error={!!urlError}
                helperText={urlError}
              />
              <LoadingButton
                sx={{ ml: 2, mt: 1, height: '40px', p: 2 }}
                variant='contained'
                onClick={() => setHelmChartUrl(gitRepositoryUrl)}
                loading={isLoadingHelmChartContent || isFetchingHelmChartContent}
              >
                Get details
              </LoadingButton>
            </Box>
            {/* Read-only fields for the fetched chart data. */}
            <TextField label='Name' value={chartName} fullWidth disabled sx={disabledSx} />
            <TextField label='Description' multiline value={chartDescription} fullWidth disabled sx={disabledSx} />
            <TextField label='App Version' value={chartAppVersion} fullWidth disabled sx={disabledSx} />
            <TextField label='Version' value={chartVersion} fullWidth disabled sx={disabledSx} />
            {/* Icon URL field with preview image next to it */}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <TextField
                label='Icon URL (optional)'
                value={chartIcon}
                onChange={(e) => setChartIcon(e.target.value)}
                fullWidth
                disabled={!connectionTested}
                sx={disabledSx}
              />
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {chartIcon ? (
                  <img
                    src={chartIcon}
                    alt='Icon preview'
                    style={{ maxWidth: '50px', maxHeight: '50px', objectFit: 'contain', marginTop: '5px' }}
                  />
                ) : (
                  <DefaultLogo width='50px' height='50px' />
                )}
              </Box>
            </Box>
            <TextField
              label='Target Directory Name'
              value={chartTargetDirName}
              onChange={(e) => setChartTargetDirName(e.target.value)}
              fullWidth
              disabled={!connectionTested}
              sx={disabledSx}
              error={Boolean(checkDirectoryName(chartTargetDirName, chartDirectories))}
              helperText={helmChartUrl && checkDirectoryName(chartTargetDirName, chartDirectories)}
            />
            <Typography variant='body2'>
              {`The Helm chart will be added at: `}
              <Typography variant='body2' display='inline' sx={{ textDecoration: 'underline' }}>
                {`https://gitea.${cluster.domainSuffix}/otomi/charts/${chartTargetDirName}`}
              </Typography>
            </Typography>
            <FormControlLabel
              control={
                <Checkbox checked={allowTeams} onChange={(e) => setAllowTeams(e.target.checked)} color='primary' />
              }
              label='Allow teams to use this chart'
            />
          </Box>
        </ModalContent>
        <ModalFooter>
          <Button variant='text' color='inherit' onClick={handleCancel ?? handleClose}>
            {cancelButtonText ?? 'Cancel'}
          </Button>
          <LoadingButton
            variant='contained'
            color={actionButtonColor || 'error'}
            sx={{ ml: 1, bgcolor: actionButtonColor }}
            onClick={handleSubmit}
            disabled={!isFormValid || isLoading}
            loading={isLoading}
            startIcon={actionButtonFrontIcon}
            endIcon={actionButtonEndIcon}
          >
            {actionButtonText}
          </LoadingButton>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
