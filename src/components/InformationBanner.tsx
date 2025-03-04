import { Box, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import Iconify from './Iconify'

const StyledInfoBanner = styled(Box)({
  backgroundColor: '#f2f2894d',
  padding: '10px',
  border: '1px solid #d4d402',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
})

interface Props {
  message: string
  children?: React.ReactNode
}

export default function InformationBanner({ message, children }: Props) {
  const theme = useTheme()
  return (
    <StyledInfoBanner>
      <Iconify icon='material-symbols:info' width={40} height={28} color='#c7d030d9' />
      <Typography sx={{ color: theme.palette.text.primary }}>{message}</Typography>
      {children}
    </StyledInfoBanner>
  )
}
