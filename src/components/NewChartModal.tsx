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
  // State for the Github URL and chart fields
  const [githubUrl, setGithubUrl] = useState('')
  const [chartName, setChartName] = useState('')
  const [chartIcon, setChartIcon] = useState('')
  const [chartPath, setChartPath] = useState('')
  const [revision, setRevision] = useState('')
  const [allowTeams, setAllowTeams] = useState(true)

  // Determines whether the GitHub URL is valid (i.e. a non-empty string that ends with "chart.yaml")
  const isValidGithubChartUrl = githubUrl.trim() !== '' && githubUrl.toLowerCase().endsWith('chart.yaml')

  const getChart = async () => {
    if (!githubUrl) {
      console.error('No URL provided')
      return
    }
    console.log('Test connection clicked with URL:', githubUrl)
    try {
      // Validate the URL
      const parsedUrl = new URL(githubUrl)
      if (!parsedUrl.hostname.includes('github.com') || !parsedUrl.pathname.includes('/blob/')) {
        console.error('Invalid URL format for a GitHub chart file.')
        return
      }

      // Convert GitHub URL to a raw file URL.
      // e.g., "https://github.com/nats-io/k8s/blob/main/helm/charts/nats/Chart.yaml"
      // becomes "https://raw.githubusercontent.com/nats-io/k8s/main/helm/charts/nats/Chart.yaml"
      const rawUrl = githubUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '')

      // Fetch the YAML file from the raw URL.
      const response = await fetch(rawUrl)
      if (!response.ok) {
        console.error('Failed to fetch the chart file.')
        return
      }
      const yamlText = await response.text()

      // Parse the YAML content.
      const chartData = yaml.load(yamlText) as any

      // Set the chart name and icon (if missing, default to empty string so user can edit)
      setChartName(chartData.name || '')
      setChartIcon(chartData.icon || '')

      // Parse the original URL to extract revision and chart path.
      // Example pathname: "/nats-io/k8s/blob/main/helm/charts/nats/Chart.yaml"
      const pathSegments = parsedUrl.pathname.split('/').filter(Boolean)
      // Expected structure:
      // [ owner, repo, "blob", revision, ...chartPath, fileName ]
      if (pathSegments.length < 5 || pathSegments[2] !== 'blob') {
        console.error('Unexpected URL format.')
        return
      }
      const rev = pathSegments[3]
      const chartPathSegments = pathSegments.slice(4, pathSegments.length - 1)
      const cp = chartPathSegments.join('/')

      setRevision(rev)
      setChartPath(cp)

      // Log the extracted values.
      console.log('Name:', chartData.name)
      console.log('Icon:', chartData.icon)
      console.log('Chart Path:', cp)
      console.log('Revision:', rev)
    } catch (error) {
      console.error('Error fetching or processing chart:', error)
    }
  }

  // Common sx style to grey out disabled inputs.
  const disabledSx = {
    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: '#58585833',
    },
    '& .MuiFormLabel-root.MuiInputLabel-root.Mui-disabled': {
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
              Please provide a valid GitHub URL pointing to a Chart.yaml file. The URL must end with chart.yaml.
            </Typography>
            {/* Display the chart icon as a non-interactive image.
                If chartIcon is not set, show a default placeholder image. */}
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
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <TextField
                sx={{ width: '400px' }}
                placeholder='Github URL'
                label='Github URL'
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <Button sx={{ ml: 2, mt: 1, height: '40px', p: 2 }} variant='contained' onClick={getChart}>
                Test connection
              </Button>
            </Box>
            {/* Editable fields for the fetched chart data. They remain disabled until a valid URL is provided. */}
            <TextField
              label='Chart Name'
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              fullWidth
              disabled={!isValidGithubChartUrl}
              sx={disabledSx}
            />
            <TextField
              label='Icon URL'
              value={chartIcon}
              onChange={(e) => setChartIcon(e.target.value)}
              fullWidth
              disabled={!isValidGithubChartUrl}
              sx={disabledSx}
            />
            <TextField
              label='Chart Path'
              value={chartPath}
              onChange={(e) => setChartPath(e.target.value)}
              fullWidth
              disabled={!isValidGithubChartUrl}
              sx={disabledSx}
            />
            <TextField
              label='Revision'
              value={revision}
              onChange={(e) => setRevision(e.target.value)}
              fullWidth
              disabled={!isValidGithubChartUrl}
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
        {!noFooter && (
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
              startIcon={actionButtonFrontIcon}
              endIcon={actionButtonEndIcon}
            >
              {actionButtonText}
            </Button>
          </ModalFooter>
        )}
      </ModalBox>
    </Modal>
  )
}
