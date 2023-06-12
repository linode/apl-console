import React, { useCallback, useEffect, useState } from 'react'
import { Box, CircularProgress, styled } from '@mui/material'
import useShellDrawer from 'hooks/useShellDrawer'
import { useConnectCloudttyMutation } from 'redux/otomiApi'
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
  const { user } = useSession()

  const [connect, { isLoading, isSuccess, data }] = useConnectCloudttyMutation()
  const hostname = window.location.hostname
  const domain = hostname.split('.').slice(1).join('.') || hostname

  const [transparency, setTransparency] = useState(false)

  useEffect(() => {
    if (isShell && !iFrameUrl) {
      connect({ body: { teamId: 'admin', domain, sub: user.sub } }).then((res: any) => {
        console.log('res', res)
        onSetIFrameUrl(res.data.iFrameUrl)
      })
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
        }}
      >
        <Box sx={{ ml: '10px', mr: 'auto', display: 'flex', alignItems: 'center' }}>
          {isLoading && <CircularProgress size={16} thickness={8} />}
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
            backgroundColor: '#f4f7f9',
            borderRadius: '4px',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
        <Box onClick={onToggleShell}>
          <SvgIconStyle
            src={`/assets/${isMinimized ? 'expand' : 'minimize'}_icon.svg`}
            sx={{ width: '20px', height: 1, ml: '10px', mr: '5px' }}
          />
        </Box>
        <Box onClick={onCloseShell}>
          <SvgIconStyle src='/assets/close_icon.svg' sx={{ width: '20px', height: 1, ml: '5px', mr: '10px' }} />
        </Box>
      </Box>
      {transparency && (
        <div
          style={{
            width: '100%',
            position: 'absolute',
            backgroundColor: 'transparent',
            height: '100%',
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
