import { AppBar, Box, MenuItem, Select, Stack, Toolbar, Typography, styled } from '@mui/material'
import { HEADER, NAVBAR } from 'config'
import useOffSetTop from 'hooks/useOffSetTop'
import useResponsive from 'hooks/useResponsive'
import { useSession } from 'providers/Session'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import { GetTeamsApiResponse, useGetTeamsQuery } from 'redux/otomiApi'
import useSettings from 'hooks/useSettings'
import AccountPopover from './AccountPopover'
import { IconButtonAnimate } from './animate'
import Iconify from './Iconify'

type Props = {
  onOpenSidebar: VoidFunction
  isCollapse?: boolean
  verticalLayout?: boolean
}

// ----------------------------------------------------------------------

type RootStyleProps = {
  isCollapse: boolean
  isOffset: boolean
  verticalLayout: boolean
}

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})<RootStyleProps>(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  boxShadow: 'none',
  color: '#585656',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
  },
}))

// ----------------------------------------------------------------------

export default function Header({ onOpenSidebar, isCollapse = false, verticalLayout = false }: Props) {
  const { themeView, onChangeView } = useSettings()
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout
  const isDesktop = useResponsive('up', 'lg')
  const history = useHistory()
  const {
    settings: {
      cluster,
      otomi: { additionalClusters = [] },
    },
    user: { email, teams: userTeams, isPlatformAdmin },
    oboTeamId,
    setOboTeamId,
  } = useSession()
  const { data: allTeams } = useGetTeamsQuery()
  const { t } = useTranslation()
  // END HOOKs
  let teams: GetTeamsApiResponse
  const allClusters = [...additionalClusters, cluster]
  if (isPlatformAdmin) {
    teams = ((allTeams as any) || []).map(({ id }) => ({
      id,
    }))
  } else {
    teams = (userTeams as any).map((id) => ({
      id,
    }))
  }

  const handleChangeView = (event) => {
    const view = event.target.value
    onChangeView(event)
    if (view === 'team' && oboTeamId === 'admin') history.push('/teams/admin/services')
    else history.push('/')
    event.preventDefault()
  }

  const handleChangeTeam = (event) => {
    const teamId = event.target.value as string
    const path = window.location.pathname
    const teamPart = `/teams/${oboTeamId}`
    const newTeamPart = `/teams/${teamId}`
    const hasTeamId = path.includes(teamId)
    const hasTeamPart = path.includes(teamPart)
    const hasIDvalue = path.split('/').length === 5
    let url: string
    if (teamId) {
      if (hasTeamPart && !hasIDvalue) url = path.replace(teamPart, newTeamPart)
      else if (hasTeamId && !hasIDvalue) url = path.replace(oboTeamId, teamId)
      else url = `${newTeamPart}/services`
    } else url = hasTeamPart ? path.replace(teamPart, '') : '/teams'

    setOboTeamId(teamId)
    history.push(url)
    event.preventDefault()
  }
  const handleChangeCluster = (event) => {
    const id = event.target.value
    const [provider, name] = id.split('-')
    const { domainSuffix } = additionalClusters.find((c) => c.name === name && c.provider === provider)
    window.location.href = `https://otomi.${domainSuffix}`
  }

  return (
    <RootStyle
      sx={{ backgroundColor: 'background.header' }}
      isCollapse={isCollapse}
      isOffset={isOffset}
      verticalLayout={verticalLayout}
    >
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Iconify icon='eva:menu-2-fill' />
          </IconButtonAnimate>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction='row' alignItems='center' spacing={{ xs: 0.5, sm: 1.5 }}>
          {isPlatformAdmin && (
            <>
              <Typography>view:</Typography>
              <Select
                size='small'
                color='secondary'
                value={themeView}
                onChange={handleChangeView}
                data-cy='select-view'
              >
                <MenuItem value='platform'>platform</MenuItem>
                <MenuItem value='team'>team</MenuItem>
              </Select>
            </>
          )}

          <Typography>cluster:</Typography>
          <Select
            size='small'
            color='secondary'
            value={`${cluster.provider}-${cluster.name}`}
            onChange={handleChangeCluster}
            data-cy='select-cluster'
          >
            {allClusters.map(({ name, provider }) => {
              const id = `${provider}-${name}`
              return (
                <MenuItem key={id} value={id} data-cy={`select-cluster-${id}`}>
                  {id}
                </MenuItem>
              )
            })}
          </Select>
          <Typography variant='body1'>team:</Typography>
          <Select
            size='small'
            color='secondary'
            value={(teams.length && oboTeamId) || ''}
            onChange={handleChangeTeam}
            data-cy='select-oboteam'
          >
            {isPlatformAdmin && (
              <MenuItem value='admin' data-cy='select-oboteam-admin'>
                {t('admin')}
              </MenuItem>
            )}
            {teams.map(({ id }) => (
              <MenuItem key={id} value={id} data-cy={`select-oboteam-${id}`}>
                {id}
              </MenuItem>
            ))}
          </Select>
          <AccountPopover email={email} />
        </Stack>
      </Toolbar>
    </RootStyle>
  )
}
