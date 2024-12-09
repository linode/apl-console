import { Box, Button, Paper, Stack, Typography } from '@mui/material'
import axios from 'axios'
import { findLast, isEmpty, takeRight } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useEditSettingsMutation } from 'redux/otomiApi'
import YAML from 'yaml'

interface Props {
  version?: string
}

interface VersionUpdates {
  currentVersionUpdates?: VersionInfo[]
  latestVersionUpdates?: VersionInfo[]
}

interface VersionInfo {
  version: string
  message: string
}

function parseUpdates(updates: VersionInfo[], currentVersion: string): VersionUpdates {
  const parseVersion = (version: string) => version.replace('v', '').split('.').map(Number)

  const compareVersions = (v1: string, v2: string) => {
    const [major1, minor1, patch1] = parseVersion(v1)
    const [major2, minor2, patch2] = parseVersion(v2)
    if (major1 !== major2) return major1 - major2
    if (minor1 !== minor2) return minor1 - minor2
    return patch1 - patch2
  }

  // Parse the current version
  const [currentMajor] = parseVersion(currentVersion)

  // Filter and sort updates
  const currentVersionUpdates = updates
    .filter(({ version }) => {
      const [major] = parseVersion(version)
      return major === currentMajor && compareVersions(version, currentVersion) >= 0
    })
    .sort((a, b) => compareVersions(a.version, b.version))

  const latestMajorVersion = currentMajor + 2
  const latestVersionUpdates = updates
    .filter(({ version }) => {
      const [major] = parseVersion(version)
      return major === latestMajorVersion
    })
    .sort((a, b) => compareVersions(a.version, b.version))
  return {
    currentVersionUpdates: takeRight(currentVersionUpdates, 5),
    latestVersionUpdates: takeRight(latestVersionUpdates, 5),
  }
}

export default function ({ version }: Props): React.ReactElement | null {
  const { refetchSettings } = useSession()
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [edit] = useEditSettingsMutation()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://raw.githubusercontent.com/linode/apl-announcements/refs/heads/dummy-releases/updates.yaml',
        )
        console.log(response.data)
        const parsedData = YAML.parse(response.data)
        console.log(parsedData.updates[0])
        setData(parsedData.updates)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch data')
      }
    }

    fetchData()
  }, [])
  const handleSubmit = (version: string) => {
    edit({
      settingId: 'otomi',
      body: {
        otomi: {
          version,
        },
      },
    }).then(refetchSettings)
  }
  const versionUpgrades = parseUpdates(data, 'v4.1.0')
  console.log(version)
  console.log(versionUpgrades)
  if (isEmpty(versionUpgrades)) return null
  return (
    <Box
      sx={{
        backgroundColor: '#3d3d42',
        color: '#FFFFFF',
        padding: '1rem',
        paddingLeft: '2.5rem',
        paddingRight: '2.5rem',
        maxWidth: '75rem',
        margin: '1rem auto',
      }}
    >
      {!showDetails ? (
        <Box>
          <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
            <Typography variant='h5' fontWeight='bold'>
              Upgrades Available!
            </Typography>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                handleSubmit(findLast(versionUpgrades?.currentVersionUpdates)?.version)
              }}
            >
              Upgrade to {findLast(versionUpgrades.currentVersionUpdates)?.version}
            </Button>
          </Stack>

          <Typography variant='body1' mb={1}>
            Current Version: {version}
          </Typography>

          <Typography
            variant='body2'
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setShowDetails(true)}
          >
            Here&apos;s what you missed &gt;
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant='h5' fontWeight='bold' mb={2}>
            Available Updates
          </Typography>
          <Typography
            variant='body2'
            sx={{ cursor: 'pointer', textDecoration: 'underline', paddingBottom: '0.1rem' }}
            onClick={() => setShowDetails(false)}
          >
            Go Back &lt;
          </Typography>
          <Paper
            sx={{
              color: '#FFFFFF',
              padding: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
            }}
          >
            <Typography variant='h6' mb={1}>
              Current Updates (v{version.split('.')[0]})
            </Typography>
            {versionUpgrades?.currentVersionUpdates?.map((update, index) => (
              <Box
                sx={{
                  backgroundColor: '#3A3A3A',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Typography sx={{ marginRight: '2rem' }}>{update.version}</Typography>
                <Typography sx={{ textAlign: 'left' }}>{update.message}</Typography>
              </Box>
            ))}
            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: '1rem' }}
              onClick={() => {
                handleSubmit(findLast(versionUpgrades?.currentVersionUpdates)?.version)
              }}
            >
              Upgrade to {findLast(versionUpgrades?.currentVersionUpdates)?.version}
            </Button>
          </Paper>

          <Paper
            sx={{
              color: '#FFFFFF',
              padding: '1rem',
            }}
          >
            <Typography variant='h6' mb={1}>
              Latest Major Updates
            </Typography>
            {versionUpgrades?.latestVersionUpdates?.map((update, index) => (
              <Box
                sx={{
                  backgroundColor: '#3A3A3A',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                }}
              >
                <Typography sx={{ marginRight: '2rem' }}>{update.version}</Typography>
                <Typography sx={{ textAlign: 'left' }}>{update.message}</Typography>
              </Box>
            ))}
            <Button
              variant='contained'
              color='primary'
              sx={{ marginTop: '1rem' }}
              onClick={() => {
                handleSubmit(findLast(versionUpgrades?.latestVersionUpdates)?.version)
              }}
            >
              Upgrade to {findLast(versionUpgrades?.latestVersionUpdates)?.version}
            </Button>
          </Paper>
        </Box>
      )}
    </Box>
  )
}
