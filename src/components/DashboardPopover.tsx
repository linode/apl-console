import React from 'react'
import { Box, Popover, Typography } from '@mui/material'

interface DashboardPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  title: string
  description: string
  PaperProps?: object
}

export default function DashboardPopover({
  open,
  anchorEl,
  onClose,
  title,
  description,
  PaperProps = {
    sx: {
      height: 'auto',
      width: '346px',
      borderRadius: 0,
      boxShadow: 1,
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    },
  },
}: DashboardPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: -145, horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      PaperProps={{ sx: { zIndex: 1500 }, ...PaperProps }}
      hideBackdrop
      sx={{ height: 'auto', width: '346px' }}
    >
      <Box
        sx={{
          padding: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant='subtitle2'
          sx={{
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant='body1'
          sx={{
            fontFamily: (theme) => theme.font.normal,
            fontSize: '14px',
            lineHeight: '20px',
            fontWeight: 400,
            color: 'text.secondary',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Popover>
  )
}
