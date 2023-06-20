import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, styled, useTheme } from '@mui/material'
import useShellDrawer from 'hooks/useShellDrawer'
import { ConnectCloudttyApiResponse, useConnectCloudttyMutation, useDeleteCloudttyMutation } from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import SvgIconStyle from 'components/SvgIconStyle'
import { NAVBAR } from '../config'

// ----------------------------------------------------------------------

type ShellStyleProps = {
  collapseClick: boolean
  drawerHeight: number
}

const ShellStyle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapseClick',
})<ShellStyleProps>(({ collapseClick, drawerHeight, theme }) => ({
  flexGrow: 1,
  position: 'fixed',
  bottom: 0,
  right: 0,
  backgroundColor: '#2b2b2b',
  height: `${drawerHeight}px`,
  ...(collapseClick
    ? {
        width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
      }
    : { width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)` }),
}))

// ----------------------------------------------------------------------

interface ShellButtonProps {
  src: string
  onClick: () => void
}

function ShellButton({ src, onClick }: ShellButtonProps): React.ReactElement {
  return (
    <Box onClick={onClick}>
      <SvgIconStyle src={src} sx={{ width: '16px', height: 1, ml: '5px', mr: '5px' }} />
    </Box>
  )
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
  const theme = useTheme()
  const { user, oboTeamId } = useSession()
  console.log('user', user)
  const [transparency, setTransparency] = useState(false)
  const [connect, { isLoading, isSuccess, data }] = useConnectCloudttyMutation()
  const [del] = useDeleteCloudttyMutation()

  const teamId = oboTeamId
  const hostname = window.location.hostname
  const domain = hostname.split('.').slice(1).join('.') || hostname
  const emailNoSymbols = user.email.replaceAll('@', '-').replaceAll('.', '-')

  useEffect(() => {
    if (isShell) {
      connect({ body: { teamId, domain, emailNoSymbols, isAdmin: true } }).then(
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
    del({ body: { teamId, domain, emailNoSymbols } })
  }

  return (
    <ShellStyle collapseClick={collapseClick} drawerHeight={shellHeight}>
      <Box
        sx={{
          width: '100%',
          height: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#2b2b2b',
          position: 'relative',
          pl: '10px',
          pr: '10px',
        }}
      >
        <Box sx={{ mr: 'auto', display: 'flex', alignItems: 'center' }}>
          {isLoading ? <CircularProgress size={16} thickness={8} /> : <Box>{`team-${teamId}`}</Box>}
        </Box>
        <Box
          sx={{
            width: '100px',
            cursor: 'ns-resize',
            padding: '4px 0 0',
            position: 'absolute',
            top: '8px',
            left: 'calc(50% - 50px)',
            right: 'calc(50% - 50px)',
            zIndex: 100,
            backgroundColor: transparency ? theme.palette.primary.main : '#f4f7f9',
            borderRadius: '4px',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <ShellButton src='/assets/openInNew_icon.svg' onClick={handleOpenInNew} />
        <ShellButton src='/assets/delete_icon.svg' onClick={handleDeletePod} />
        <ShellButton src={`/assets/${isMinimized ? 'expand' : 'minimize'}_icon.svg`} onClick={onToggleShell} />
        <ShellButton src='/assets/close_icon.svg' onClick={onCloseShell} />
      </Box>
      {/* By adding an absolute transparent div overlay, we ensure that the onmouseup event remains active even when the mouse is over the iframe. 
      This allows us to capture mouse release events reliably and perform necessary actions within our Shell component. */}
      {transparency && (
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: 'calc(100% - 20px)',
            backgroundColor: 'transparent',
          }}
        />
      )}
      <iframe
        title='Shell iFrame'
        src={iFrameUrl}
        style={{ width: '100%', height: '100%', border: 'none', borderTop: '1px dashed #919eab3d' }}
      />
    </ShellStyle>
  )
}

export default Shell
