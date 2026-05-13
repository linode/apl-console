import { skipToken } from '@reduxjs/toolkit/query/react'
import { AppBar, Box, MenuItem, Select, Stack, Toolbar, Typography, styled } from '@mui/material'
import { HEADER, NAVBAR } from 'config'
import useOffSetTop from 'hooks/useOffSetTop'
import useResponsive from 'hooks/useResponsive'
import { useSession } from 'providers/Session'
import { useHistory, useLocation } from 'react-router-dom'
import { useGetAplTeamsQuery } from 'redux/otomiApi'
import useSettings from 'hooks/useSettings'
import React from 'react'
import { useLocalStorage } from 'hooks/useLocalStorage'
import AccountPopover from './AccountPopover'
import { IconButtonAnimate } from './animate'
import Iconify from './Iconify'

type Props = {
  onOpenSidebar: VoidFunction
  isCollapse?: boolean
  verticalLayout?: boolean
}

type TeamOption = {
  value: string
  label: string
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

const StyledSelect = styled(Select)(() => ({
  width: 120,
  minWidth: 120,
  '& .MuiSelect-select': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}))

// ----------------------------------------------------------------------

export default function Header({ onOpenSidebar, isCollapse = false, verticalLayout = false }: Props) {
  const { themeView, onChangeView } = useSettings()
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout
  const isDesktop = useResponsive('up', 'lg')
  const history = useHistory()
  const { pathname } = useLocation()
  const {
    user: { email, teams: userTeams, isPlatformAdmin },
    oboTeamId: sessionOboTeamId,
    setOboTeamId,
  } = useSession()
  const [localOboTeamId] = useLocalStorage<string>('oboTeamId', undefined)
  const oboTeamId = sessionOboTeamId || localOboTeamId || undefined

  const { data: allTeams } = useGetAplTeamsQuery(isPlatformAdmin ? undefined : skipToken)

  let teams: TeamOption[] = []

  if (isPlatformAdmin) {
    teams =
      allTeams?.map((team) => ({
        value: team.metadata.labels['apl.io/teamId'],
        label: team.metadata.name,
      })) || []

    teams = teams.filter((team) => Boolean(team.value))
    teams = Array.from(new Map(teams.map((team) => [team.value, team])).values())
    teams = teams.filter((team) => team.value !== 'admin')
    teams.sort((a, b) => a.label.localeCompare(b.label))
    teams = [{ value: 'admin', label: 'admin' }, ...teams]
  } else {
    teams = (userTeams || []).map((team) => ({
      value: team,
      label: team,
    }))
  }

  const handleChangeView = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChangeView(event)
    history.push('/')
    event.preventDefault()
  }

  const redirectToDashboard = (nextTeamId: string): boolean => {
    if (nextTeamId === 'admin') {
      return (
        pathname === `/apps/${oboTeamId}` ||
        pathname === `/teams/${oboTeamId}/users` ||
        pathname === `/teams/${oboTeamId}`
      )
    }
    return false
  }

  const getNextPathname = (nextTeamId: string): string => {
    if (redirectToDashboard(nextTeamId)) return '/'
    if (pathname === '/apps/admin' && themeView === 'platform') return pathname
    return pathname.replace(oboTeamId, nextTeamId)
  }

  const handleChangeTeam = (event) => {
    const nextTeamId = event.target.value as string
    if (nextTeamId === oboTeamId) return
    const nextPathname = getNextPathname(nextTeamId)
    setOboTeamId(nextTeamId)
    history.push(nextPathname)
    event.preventDefault()
  }

  if (!teams.length && oboTeamId) teams = [{ value: oboTeamId, label: oboTeamId }]

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
          {themeView === 'team' && (
            <>
              <Typography variant='body1'>Team:</Typography>
              <StyledSelect
                size='small'
                color='secondary'
                value={oboTeamId || ''}
                onChange={handleChangeTeam}
                data-cy='select-oboteam'
              >
                {teams.map((team) => (
                  <MenuItem key={team.value} value={team.value} data-cy={`select-oboteam-${team.value}`}>
                    {team.label}
                  </MenuItem>
                ))}
              </StyledSelect>
            </>
          )}
          {isPlatformAdmin && (
            <>
              <Typography>View:</Typography>
              <StyledSelect
                size='small'
                color='secondary'
                value={themeView}
                onChange={handleChangeView}
                data-cy='select-view'
              >
                <MenuItem value='platform'>platform</MenuItem>
                <MenuItem value='team'>team</MenuItem>
              </StyledSelect>
            </>
          )}
          <AccountPopover email={email} />
        </Stack>
      </Toolbar>
    </RootStyle>
  )
}
