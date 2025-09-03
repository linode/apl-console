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

// Removed StyledPopoverPaper to use Box directly for styling

export default function DashboardPopover({
  open,
  anchorEl,
  onClose,
  title,
  description,
  PaperProps = { sx: { height: 'auto', width: '346px', borderRadius: 4, boxShadow: 1 } },
}: DashboardPopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: -130, horizontal: 'center' }}
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
        <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant='body1' sx={{ fontSize: 13, opacity: 0.8, color: 'cl.text.subTitle' }}>
          {description}
        </Typography>
      </Box>
    </Popover>
  )
}
