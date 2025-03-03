import React, { useState } from 'react'
import {
  Box,
  Button,
  ButtonPropsColorOverrides,
  Checkbox,
  FormControlLabel,
  IconButton,
  Modal,
  TextField,
  Typography,
  styled,
} from '@mui/material'
// eslint-disable-next-line import/no-unresolved
import { OverridableStringUnion } from '@mui/types'
import yaml from 'js-yaml'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
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

// interface and component -----------------------------------------------
interface Props {
  title?: string
  noHeader?: boolean
  noFooter?: boolean
  children?: React.ReactNode
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
}

interface NewChartValues {
  url: string
  chartName: string
  chartIcon?: string
  chartPath: string
  revision: string
  allowTeams: boolean
}

export default function NewChartModal({
  title,
  noHeader,
  noFooter,
  children,
  open,
  handleClose,
  handleCancel,
  cancelButtonText,
  handleAction,
  actionButtonText,
  actionButtonColor,
  actionButtonEndIcon,
  actionButtonFrontIcon,
}: Props) {
  const [githubUrl, setGithubUrl] = useState('')
  const [chartName, setChartName] = useState('')
  const [chartIcon, setChartIcon] = useState('')
  const [chartPath, setChartPath] = useState('')
  const [revision, setRevision] = useState('')
  const [allowTeams, setAllowTeams] = useState(true)
  const [connectionTested, setConnectionTested] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)

  // Form is valid if the connection has been tested, required fields are non-empty, and no URL error exists.
  const isFormValid =
    connectionTested &&
    chartName.trim() !== '' &&
    chartPath.trim() !== '' &&
    revision.trim() !== '' &&
    githubUrl.trim() !== '' &&
    !urlError

  // Validate and update the URL error whenever the URL changes.
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setGithubUrl(val)
    setConnectionTested(false)
    try {
      const parsedUrl = new URL(val)
      if (!parsedUrl.hostname.includes('github.com'))
        setUrlError('URL must be a valid GitHub URL (containing github.com.')
      else if (!val.toLowerCase().endsWith('chart.yaml'))
        setUrlError("This is a valid GitHub URL but does not end with 'chart.yaml'.")
      else setUrlError(null)
    } catch (error) {
      setUrlError('Invalid URL format.')
    }
  }

  const getChart = async () => {
    if (!githubUrl) {
      console.error('No URL provided')
      return
    }
    if (urlError) {
      console.error('URL error:', urlError)
      return
    }
    console.log('Test connection clicked with URL:', githubUrl)
    try {
      const parsedUrl = new URL(githubUrl)
      if (!parsedUrl.hostname.includes('github.com') || !parsedUrl.pathname.includes('/blob/')) {
        console.error('Invalid URL format for a GitHub chart file.')
        return
      }
      const rawUrl = githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '')
      const response = await fetch(rawUrl)
      if (!response.ok) {
        console.error('Failed to fetch the chart file.')
        return
      }
      const yamlText = await response.text()
      const chartData = yaml.load(yamlText) as any

      // Set chart fields (icon is optional)
      setChartName(chartData.name || '')
      setChartIcon(chartData.icon || '')
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
      if (pathSegments.length < 5 || pathSegments[2] !== 'blob') {
        console.error('Unexpected URL format.')
        return
      }
      const rev = pathSegments[3]
      const chartPathSegments = pathSegments.slice(4, pathSegments.length - 1)
      const cp = chartPathSegments.join('/')
      setRevision(rev)
      setChartPath(cp)
      console.log('Name:', chartData.name)
      console.log('Icon:', chartData.icon)
      console.log('Chart Path:', cp)
      console.log('Revision:', rev)
      setConnectionTested(true)
    } catch (error) {
      console.error('Error fetching or processing chart:', error)
      setConnectionTested(false)
    }
  }

  // Common sx style to grey out disabled inputs.
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
            <IconButton color='primary' onClick={handleClose}>
              X
            </IconButton>
          </ModalHeader>
        )}
        <ModalContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Helper text */}
            <Typography variant='body2' color='textSecondary'>
              Please provide a valid GitHub URL pointing to a Chart.yaml file. The URL must end with chart.yaml. After
              clicking Test connection, the chart details will be enabled.
            </Typography>
            {/* Display the chart icon as a non-interactive image. */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={
                  chartIcon ||
                  'https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/akamai-gqva4arap2uinswj55zve.png/akamai-4cwl4z4ddcnjbmpmzcl38.png?_a=DAJFJtWIZAAC'
                }
                alt='Chart Icon'
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
              />
            </Box>
            {/* Row for the GitHub URL input and Test Connection button */}
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <TextField
                sx={{ width: '400px' }}
                placeholder='Github URL'
                label='Github URL'
                value={githubUrl}
                onChange={handleUrlChange}
                error={!!urlError}
                helperText={urlError}
              />
              <Button sx={{ ml: 2, mt: 1, height: '40px', p: 2 }} variant='contained' onClick={getChart}>
                Test connection
              </Button>
            </Box>
            {/* Editable fields for the fetched chart data. They are enabled only if connectionTested is true. */}
            <TextField
              label='Chart Name'
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              fullWidth
              disabled={!connectionTested}
              sx={disabledSx}
            />
            <TextField
              label='Icon URL (optional)'
              value={chartIcon}
              onChange={(e) => setChartIcon(e.target.value)}
              fullWidth
              disabled={!connectionTested}
              sx={disabledSx}
            />
            <TextField
              label='Chart Path'
              value={chartPath}
              onChange={(e) => setChartPath(e.target.value)}
              fullWidth
              disabled={!connectionTested}
              sx={disabledSx}
            />
            <TextField
              label='Revision'
              value={revision}
              onChange={(e) => setRevision(e.target.value)}
              fullWidth
              disabled={!connectionTested}
              sx={disabledSx}
            />
            {/* New checkbox: Allow teams to use this chart */}
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
          <Button
            variant='contained'
            color={actionButtonColor || 'error'}
            sx={{ ml: 1, bgcolor: actionButtonColor }}
            onClick={() =>
              handleAction &&
              handleAction({
                url: githubUrl,
                chartName,
                chartIcon,
                chartPath,
                revision,
                allowTeams,
              })
            }
            disabled={!isFormValid}
            startIcon={actionButtonFrontIcon}
            endIcon={actionButtonEndIcon}
          >
            {actionButtonText}
          </Button>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
