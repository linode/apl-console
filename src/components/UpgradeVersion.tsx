import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import { findLast, isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
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
  // Helper to parse and compare semantic versions
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

  return { currentVersionUpdates, latestVersionUpdates }
}

export default function ({ version }: Props): React.ReactElement | null {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

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

  const versionUpgrades = parseUpdates(data, 'v4.1.0')
  // const versionUpgrades: VersionUpdates = {
  //   currentVersionUpdates: data,
  //   latestVersionUpdates: data,
  // }
  console.log(version)
  console.log(versionUpgrades)
  // const headCells: HeadCell[] = [
  //   {
  //     id: 'version',
  //     label: 'Version',
  //     renderer: ({ version }: any) => version,
  //   },
  //   {
  //     id: 'Message',
  //     label: 'Message',
  //     renderer: ({ message }: any) => message,
  //   },
  // ]
  if (isEmpty(versionUpgrades)) return null
  return (
    <Box sx={{ color: '#FFFFFF', padding: '20px', marginBottom: '20px' }}>
      {!showDetails ? (
        <Box
          sx={{
            direction: 'row',
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Typography variant='h3'>Upgrades Available</Typography>
            <Button
              onClick={() => {
                console.log('Upgrading...')
              }}
              sx={{
                backgroundColor: '#007BFF',
                color: '#FFFFFF',
                padding: '10px 20px',
                fontSize: '14px',
                borderRadius: '4px',
                textTransform: 'none',
                ':hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              Upgrade to {findLast(versionUpgrades?.currentVersionUpdates)?.version}
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Typography sx={{ display: 'flex' }} variant='body1'>
              Current Version {version}
            </Typography>
            <Typography
              onClick={() => {
                setShowDetails(true)
              }}
              variant='body1'
              sx={{
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Here&#39;s what you missed &gt;{' '}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: '#FFFFFF',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Typography variant='h3'>Available Updates</Typography>
            <Button
              onClick={() => {
                console.log('Upgrading...')
              }}
              sx={{
                backgroundColor: '#007BFF',
                color: '#FFFFFF',
                padding: '10px 20px',
                fontSize: '14px',
                borderRadius: '4px',
                textTransform: 'none',
                ':hover': {
                  backgroundColor: '#0056b3',
                },
              }}
            >
              Upgrade to {findLast(versionUpgrades?.currentVersionUpdates)?.version}
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Typography variant='body1'>Current Version {version}</Typography>
            <Typography
              onClick={() => {
                setShowDetails(false)
              }}
              variant='body1'
              sx={{
                fontSize: '14px',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Go back &lt;
            </Typography>
          </Box>

          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant='h4'>Current Major Version Updates</Typography>
            <table style={{ width: '100%', backgroundColor: '#2D2D2D', color: '#FFFFFF', borderCollapse: 'collapse' }}>
              <tbody>
                {versionUpgrades.currentVersionUpdates?.map((update) => (
                  <tr key={update.version}>
                    <td style={{ border: '1px solid #555', padding: '8px' }}>{update.version}</td>
                    <td style={{ border: '1px solid #555', padding: '8px' }}>{update.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant='h4'>Latest Major Version Updates</Typography>
            <table style={{ width: '100%', backgroundColor: '#2D2D2D', color: '#FFFFFF', borderCollapse: 'collapse' }}>
              <tbody>
                {versionUpgrades.latestVersionUpdates?.map((update) => (
                  <tr key={update.version}>
                    <td style={{ border: '1px solid #555', padding: '8px' }}>{update.version}</td>
                    <td style={{ border: '1px solid #555', padding: '8px' }}>{update.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          {/* <ListTable
            headCells={headCells}
            rows={versionUpgrades?.currentVersionUpdates}
            resourceType='Version'
            noCrud
          /> */}
        </Box>
      )}
    </Box>
  )
}
