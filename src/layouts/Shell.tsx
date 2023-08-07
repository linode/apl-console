import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, Tooltip, Typography, styled } from '@mui/material'
import useShellDrawer from 'hooks/useShellDrawer'
import { ConnectCloudttyApiResponse, useConnectCloudttyMutation, useDeleteCloudttyMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import SvgIconStyle from 'components/SvgIconStyle'
import useResponsive from 'hooks/useResponsive'
import { NAVBAR } from '../config'

// ----------------------------------------------------------------------

type ShellStyleProps = {
  isDesktop: boolean
  collapseClick: boolean
  drawerHeight: number
}

const ShellStyle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<ShellStyleProps>(({ isDesktop, collapseClick, drawerHeight }) => ({
  flexGrow: 1,
  position: 'fixed',
  bottom: 0,
  right: 0,
  backgroundColor: '#2b2b2b',
  paddingBottom: '1rem',
  height: `${drawerHeight}px`,
  ...(collapseClick
    ? {
        width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
      }
    : { width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)` }),
  ...(!isDesktop && { width: '100%' }),
}))

const ShellBarStyle = styled(Box)(() => ({
  width: '100%',
  height: '20px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: '#2b2b2b',
  position: 'relative',
  paddingLeft: '16px',
  paddingRight: '10px',
}))

type HandleBarStyleProps = {
  transparency: boolean
}

const HandleBarStyle = styled(Box)<HandleBarStyleProps>(({ transparency, theme }) => ({
  width: '100px',
  cursor: 'ns-resize',
  padding: '4px 0 0',
  position: 'absolute',
  top: '3px',
  left: 'calc(50% - 50px)',
  right: 'calc(50% - 50px)',
  zIndex: 100,
  backgroundColor: transparency ? theme.palette.primary.main : '#f4f7f9',
  borderRadius: '8px',
  border: '5px solid #2b2b2b',
}))

const TransparentStyle = styled(Box)(() => ({
  position: 'absolute',
  width: '100%',
  height: 'calc(100% - 20px)',
  backgroundColor: 'transparent',
}))

const IFrameStyle = styled(Box)(() => ({
  borderTop: '1px dashed #919eab3d',
  height: '100%',
}))

const LoadingMessageStyle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  padding: '1.5rem',
}))

// ----------------------------------------------------------------------

interface ShellButtonProps {
  tooltip: string
  src: string
  onClick: () => void
}

function ShellButton({ tooltip, src, onClick }: ShellButtonProps): React.ReactElement {
  return (
    <Tooltip title={tooltip}>
      <Box onClick={onClick}>
        <SvgIconStyle src={src} sx={{ width: '16px', height: 1, ml: '6px', mr: '6px', color: '#f4f7f9' }} />
      </Box>
    </Tooltip>
  )
}

interface IFrameProps {
  iFrameUrl: string
}

function IFrame({ iFrameUrl }: IFrameProps): React.ReactElement {
  return (
    <iframe
      title='Shell iFrame'
      src={iFrameUrl}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        marginLeft: '0.5rem',
      }}
    />
  )
}

const MemoizedIFrame = React.memo(IFrame)

export const getDomain = (hostname: string) => {
  return hostname.split('.').slice(1).join('.') || hostname
}

export const getEmailNoSymbols = (email: string) => {
  return email.replaceAll('@', '-').replaceAll('.', '-')
}

export const getUserTeams = (user: any) => {
  return user?.groups.filter((group: string) => group.startsWith('team-')) || []
}

interface Props {
  collapseClick?: boolean
}

function Shell({ collapseClick }: Props): React.ReactElement {
  const {
    isShell,
    isMinimized,
    iFrameUrl,
    shellHeight,
    onCloseShell,
    onSetIFrameUrl,
    onSetShellHeight,
    onToggleShell,
  } = useShellDrawer()
  const { user, oboTeamId } = useSession()
  const isDesktop = useResponsive('up', 'lg')
  const [transparency, setTransparency] = useState(false)
  const [connect, { isLoading }] = useConnectCloudttyMutation()
  const [del] = useDeleteCloudttyMutation()

  const teamId = oboTeamId
  const hostname = window.location.hostname
  const domain = getDomain(hostname)
  const emailNoSymbols = getEmailNoSymbols(user.email)
  const userTeams = getUserTeams(user)

  useEffect(() => {
    if (isShell && !iFrameUrl) {
      connect({ body: { teamId, domain, emailNoSymbols, isAdmin: user.isAdmin, userTeams, sub: user.sub } }).then(
        ({ data }: { data: ConnectCloudttyApiResponse }) => {
          onSetIFrameUrl(data.iFrameUrl)
        },
      )
    }
  }, [isShell])

  const handleMouseDown = () => {
    setTransparency(true)
    document.addEventListener('mouseup', handleMouseUp, true)
    document.addEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseUp = () => {
    setTransparency(false)
    document.removeEventListener('mouseup', handleMouseUp, true)
    document.removeEventListener('mousemove', handleMouseMove, true)
  }

  const handleMouseMove = useCallback((e) => {
    const shellHeight = window.innerHeight - e.clientY
    onSetShellHeight(shellHeight)
  }, [])

  const handleOpenInNew = () => {
    onCloseShell()
    window.open(iFrameUrl, '_blank')
  }

  const handleDeletePod = () => {
    onSetIFrameUrl('')
    onToggleShell()
    onCloseShell()
    del({ body: { teamId, domain, emailNoSymbols, isAdmin: user.isAdmin, userTeams } })
  }

  return (
    <ShellStyle isDesktop={isDesktop} collapseClick={collapseClick} drawerHeight={shellHeight}>
      <ShellBarStyle>
        <Box sx={{ mr: 'auto', display: 'flex', alignItems: 'center', color: '#f4f7f9' }}>
          {!isLoading && <Box>{`team-${user.isAdmin ? 'admin' : teamId}`}</Box>}
        </Box>
        <HandleBarStyle transparency={transparency} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} />
        <ShellButton tooltip='Open shell in a new tab' src='/assets/openInNew_icon.svg' onClick={handleOpenInNew} />
        <ShellButton tooltip='Delete shell' src='/assets/delete_icon.svg' onClick={handleDeletePod} />
        <ShellButton
          tooltip={`${isMinimized ? 'Maximize' : 'Minimize'} shell`}
          src={`/assets/${isMinimized ? 'maximize' : 'minimize'}_icon.svg`}
          onClick={onToggleShell}
        />
        <ShellButton tooltip='Close shell' src='/assets/close_icon.svg' onClick={onCloseShell} />
      </ShellBarStyle>
      {/* By adding an absolute transparent div overlay, we ensure that the onmouseup event remains active even when the mouse is over the iframe. 
      This allows us to capture mouse release events reliably and perform necessary actions within our Shell component. */}
      {transparency && <TransparentStyle />}
      <IFrameStyle>
        {isLoading ? (
          <LoadingMessageStyle>
            <CircularProgress sx={{ mb: '1rem' }} />
            <Typography>We are preparing your shell session, we will be ready in a minute!</Typography>
          </LoadingMessageStyle>
        ) : (
          <MemoizedIFrame iFrameUrl={iFrameUrl} />
        )}
      </IFrameStyle>
    </ShellStyle>
  )
}

export default Shell
