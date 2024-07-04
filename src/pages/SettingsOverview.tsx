/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
import PaperLayout from 'layouts/Paper'
import SvgIconStyle from 'components/SvgIconStyle'
import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@mui/material'
import Versions from 'components/Versions'

export default function SettingsOverview() {
  const getIcon = (name: string) => <SvgIconStyle src={`/assets/${name}`} sx={{ width: 1, height: 1 }} />

  const settings = [
    { title: 'Cluster', path: '/settings/cluster', icon: getIcon('cluster_icon.svg') },
    { title: 'APL settings', path: '/settings/otomi', icon: getIcon('akamai_icon.svg') },
    { title: 'Key Management', path: '/settings/kms', icon: getIcon('secrets_icon.svg') },
    { title: 'Alerts', path: '/settings/alerts', icon: getIcon('alert_icon.svg') },
    { title: 'Co-monitoring', path: '/settings/home', icon: getIcon('comonitoring_icon.svg') },
    { title: 'Azure', path: '/settings/azure', icon: getIcon('azure_icon.svg') },
    { title: 'DNS', path: '/settings/dns', icon: getIcon('dns_icon.svg') },
    { title: 'Ingress', path: '/settings/ingress', icon: getIcon('ingress_icon.svg') },
    { title: 'OIDC', path: '/settings/oidc', icon: getIcon('oidc_icon.svg') },
    { title: 'SMTP', path: '/settings/smtp', icon: getIcon('smtp_icon.svg') },
    { title: 'Backup', path: '/settings/platformBackups', icon: getIcon('backup_icon.svg') },
  ]
  // TODO: remove inline styling and use theming
  const SettingsCard = ({ title, path, icon }) => (
    <Grid item xs={6} sm={4} md={3} lg={3} key={title}>
      <Link
        to={{ pathname: path }}
        style={{ fontSize: '1rem', color: '#919eab', textDecoration: 'none', display: 'block' }}
      >
        <Box
          sx={{
            margin: '20px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '8px',
            backgroundColor: '#0000001f',
            transition: 'all .2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <Box sx={{ height: '50px', width: '50px', margin: '20px' }}>
            <span style={{ height: '24px', width: '24px', color: '#919eab' }}>{icon}</span>
          </Box>
          <Box sx={{ width: '200px' }}>
            <Typography sx={{ fontSize: '1rem', width: '150px' }} variant='subtitle1'>
              {title}
            </Typography>
          </Box>
        </Box>
      </Link>
    </Grid>
  )

  const comp = (
    <div>
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {settings.map((setting) => {
          return <SettingsCard key={setting.title} title={setting.title} path={setting.path} icon={setting.icon} />
        })}
      </Grid>
      <Versions />
    </div>
  )

  return <PaperLayout comp={comp} />
}
