/* eslint-disable react/prop-types */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/function-component-definition */
import PaperLayout from 'layouts/Paper'
import SvgIconStyle from 'components/SvgIconStyle'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, Typography } from '@mui/material'
import Versions from 'components/Versions'
import { jsx } from '@emotion/react'
import { useSession } from 'providers/Session'
import ConfigureGitModal from 'components/modals/ConfigureGitModal'
import { NewFeatureKey, markNewFeatureSeen } from 'utils/newFeaturesCookieManager'
import NewFeatureChip from 'components/NewFeatureChip'

interface Settings {
  title: string
  path?: string
  icon: jsx.JSX.Element
  id: string
  newFeatureKey?: NewFeatureKey
  onClick?: () => void
}

export default function SettingsOverview() {
  const getIcon = (name: string) => <SvgIconStyle src={`/assets/${name}`} sx={{ width: 1, height: 1 }} />
  const session = useSession()
  const [openGitModal, setOpenGitModal] = useState(false)

  const settings: Settings[] = [
    { title: 'Cluster', path: '/settings/cluster', icon: getIcon('cluster_icon.svg'), id: 'cluster' },
    { title: 'Platform', path: '/settings/otomi', icon: getIcon('akamai_icon.svg'), id: 'aplSettings' },
    { title: 'Secrets', path: '/settings/kms', icon: getIcon('secrets_icon.svg'), id: 'kms' },
    { title: 'Alerts', path: '/settings/alerts', icon: getIcon('alert_icon.svg'), id: 'alerts' },
    { title: 'DNS', path: '/settings/dns', icon: getIcon('dns_icon.svg'), id: 'dns' },
    { title: 'Ingress', path: '/settings/ingress', icon: getIcon('ingress_icon.svg'), id: 'ingress' },
    { title: 'OIDC', path: '/settings/oidc', icon: getIcon('oidc_icon.svg'), id: 'oidc' },
    { title: 'Backup', path: '/settings/platformBackups', icon: getIcon('backup_icon.svg'), id: 'backup' },
    { title: 'Object Storage', path: '/settings/obj', icon: getIcon('cloud_upload.svg'), id: 'objectStorage' },
    {
      title: 'GitOps',
      icon: getIcon('git_icon.svg'),
      id: 'git',
      newFeatureKey: 'settings-gitops',
      onClick: () => {
        markNewFeatureSeen('settings-gitops')
        setOpenGitModal(true)
      },
    },
  ]

  const removePreInstalledSpecificSettings = ['kms', 'dns', 'ingress']
  let filteredSettings: Settings[] = settings

  if (session.settings.otomi.isPreInstalled)
    filteredSettings = settings.filter((setting) => !removePreInstalledSpecificSettings.includes(setting.id))

  const CardContent = ({
    title,
    icon,
    newFeatureKey,
  }: {
    title: string
    icon: jsx.JSX.Element
    newFeatureKey?: NewFeatureKey
  }) => (
    <Box
      sx={{
        m: 2,
        px: 3,
        py: 3,
        display: 'flex',
        alignItems: 'center',
        borderRadius: 2,
        backgroundColor: '#0000001f',
        transition: 'all .2s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      <Box
        sx={{
          width: 'clamp(32px, 3vw, 40px)',
          height: 'clamp(32px, 3vw, 40px)',
          minWidth: 'clamp(32px, 3vw, 40px)',
          mr: 2,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#919eab',
        }}
      >
        {icon}
      </Box>

      <Typography
        variant='subtitle1'
        sx={{
          flexGrow: 1,
          fontSize: '1rem',
        }}
      >
        {title}
      </Typography>

      {newFeatureKey && (
        <Box sx={{ ml: 2 }}>
          <NewFeatureChip feature={newFeatureKey} />
        </Box>
      )}
    </Box>
  )

  const SettingsCard = ({ title, path, icon, onClick, newFeatureKey }: Settings) => (
    <Grid item xs={6} sm={4} md={3} lg={3} key={title}>
      {path ? (
        <Link
          to={{ pathname: path }}
          style={{ fontSize: '1rem', color: '#919eab', textDecoration: 'none', display: 'block' }}
        >
          <CardContent title={title} icon={icon} newFeatureKey={newFeatureKey} />
        </Link>
      ) : (
        <Box
          onClick={onClick}
          sx={{
            fontSize: '1rem',
            color: '#919eab',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <CardContent title={title} icon={icon} newFeatureKey={newFeatureKey} />
        </Box>
      )}
    </Grid>
  )

  const comp = (
    <div>
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {filteredSettings.map((setting) => (
          <SettingsCard
            key={setting.title}
            title={setting.title}
            path={setting.path}
            icon={setting.icon}
            id={setting.id}
            onClick={setting.onClick}
            newFeatureKey={setting.newFeatureKey}
          />
        ))}
      </Grid>

      <ConfigureGitModal open={openGitModal} onClose={() => setOpenGitModal(false)} />
      <Versions />
    </div>
  )

  return <PaperLayout comp={comp} />
}
