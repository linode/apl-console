import { Avatar, Box, Divider, MenuItem, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import React, { useState } from 'react'
import { useDeleteCloudttyMutation } from 'redux/otomiApi'
import { clearLocalStorage } from 'hooks/useLocalStorage'
import { useHistory } from 'react-router-dom'
import MenuPopover from './MenuPopover'
import { IconButtonAnimate } from './animate'
import SettingMode from './SettingMode'

type Props = {
  email: string
}

export default function AccountPopover({ email }: Props) {
  const history = useHistory()
  const [open, setOpen] = useState<HTMLElement | null>(null)
  const [deleteCloudtty] = useDeleteCloudttyMutation()

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = () => {
    setOpen(null)
  }

  const handleLogout = () => {
    deleteCloudtty().finally(() => {
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
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
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
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Box sx={{ my: 1.5, px: 2.5 }}>
          <SettingMode />
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1, color: 'red' }}>
          Sign out
        </MenuItem>
      </MenuPopover>
    </>
  )
}
