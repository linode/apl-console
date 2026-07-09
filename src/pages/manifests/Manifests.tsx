import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { LandingHeader } from 'components/LandingHeader'
import Section from 'components/Section'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import { useGetGitSettingsQuery } from 'redux/otomiApi'
import { DEFAULT_GIT_SERVER_URL } from 'utils/constants'

export default function Manifests() {
  const {
    user: { isPlatformAdmin },
    settings: {
      cluster: { domainSuffix },
    },
  } = useSession()

  const { data: gitSettings } = useGetGitSettingsQuery(undefined, {
    skip: !isPlatformAdmin,
  })

  const isDefaultGitConfiguration = gitSettings?.repoUrl?.includes(DEFAULT_GIT_SERVER_URL) ?? false

  const repoUrl = isDefaultGitConfiguration ? `https://git.${domainSuffix}/otomi/values` : gitSettings?.repoUrl || ''

  const techDocsUrl = 'https://techdocs.akamai.com/app-platform/docs/manifests'

  const handleCopyValuesRepoUrl = async () => {
    if (!repoUrl) return
    await navigator.clipboard.writeText(repoUrl)
  }

  return (
    <PaperLayout title='Manifests'>
      <LandingHeader title='Manifests' />

      <Section>
        <Box sx={{ maxWidth: 900 }}>
          <Typography
            sx={{
              mb: 3,
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'text.primary',
            }}
          >
            The platform ships with a GitOps system pre-configured. Within the values repository, the{' '}
            <strong>env/manifests/</strong> directory is automatically reconciled into the cluster. Any Kubernetes
            manifests placed in this directory are applied automatically.
          </Typography>

          <Box
            sx={{
              mb: 4,
              p: '14px 16px',
              borderRadius: 2,
              border: '1px solid rgba(145, 158, 171, 0.24)',
              backgroundColor: 'rgba(145, 158, 171, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant='subtitle2'>Values repository</Typography>

              <Typography
                variant='body2'
                sx={{
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: 'text.secondary',
                }}
              >
                {repoUrl}
              </Typography>
            </Box>

            <Tooltip title='Copy values repository URL'>
              <IconButton
                aria-label='Copy values repository URL'
                color='primary'
                onClick={handleCopyValuesRepoUrl}
                disabled={!repoUrl}
              >
                <ContentCopyIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography
            sx={{
              mb: 3,
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'text.secondary',
            }}
          >
            The App Platform does not yet provide a web interface for managing manifests. Use your Git client to add,
            modify, or remove files in the values repository.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
            <Button
              variant='contained'
              href={repoUrl}
              target='_blank'
              rel='noopener noreferrer'
              endIcon={<OpenInNewIcon />}
              sx={{ textTransform: 'none' }}
              disabled={!repoUrl}
            >
              Open manifests directory
            </Button>

            <Button
              variant='outlined'
              href={techDocsUrl}
              target='_blank'
              rel='noopener noreferrer'
              endIcon={<OpenInNewIcon />}
              sx={{ textTransform: 'none' }}
            >
              View Techdocs
            </Button>
          </Box>
        </Box>
      </Section>
    </PaperLayout>
  )
}
