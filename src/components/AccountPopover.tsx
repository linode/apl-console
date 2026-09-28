import { Avatar, Box, Divider, MenuItem, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import React, { useState } from 'react'
import { useDeleteCloudttyMutation } from 'redux/otomiApi'
import { clearLocalStorage } from 'hooks/useLocalStorage'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import MenuPopover from './MenuPopover'
import { IconButtonAnimate } from './animate'
import SettingMode from './SettingMode'

type Props = {
  email: string
}

export default function AccountPopover({ email }: Props) {
  const history = useHistory()
  const { oboTeamId } = useSession()
  const [open, setOpen] = useState<HTMLElement | null>(null)
  const [deleteCloudtty] = useDeleteCloudttyMutation()

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = () => {
    deleteCloudtty({ teamId: oboTeamId }).finally(() => {
      clearLocalStorage('oboTeamId')
      history.push('/logout')
    })
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          borderRadius: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: 'inherit',
              position: 'absolute',
              bgcolor: (theme) => alpha(String(theme.palette.text.primary), 0.8),
            },
          }),
        }}
      >
        <Avatar alt={email} />
      </IconButtonAnimate>
      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          width: 300,
          '& .MuiMenuItem-root': {
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            borderRadius: 0,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography
            variant='body2'
            sx={{
              color: 'text.secondary',
              fontFamily: (theme) => theme.font.normal,
              fontSize: '14px',
              lineHeight: '20px',
              fontWeight: 400,
            }}
            noWrap
          >
            {email}
          </Typography>
        </Box>

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <SettingMode />
        </Box>

        <Divider sx={{ borderColor: 'divider' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'error.main' }}>
          Sign out
        </MenuItem>
      </MenuPopover>
    </>
  )
}
