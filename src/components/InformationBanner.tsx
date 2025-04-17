import { Box, SxProps, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import Iconify from './Iconify'

const StyledInfoBanner = styled(Box)<{ small?: boolean }>(({ theme, small }) => ({
  backgroundColor: '#f2f2894d',
  padding: small ? '5px' : '10px',
  border: '1px solid #d4d402',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  maxWidth: small ? '800px' : 'inherit',
}))

interface Props {
  message: string | React.ReactNode
  small?: boolean
  children?: React.ReactNode
  sx?: SxProps
}

export default function InformationBanner({ message, children, small, sx }: Props) {
  const theme = useTheme()
  return (
    <StyledInfoBanner small={small} sx={{ ...sx }}>
      <Iconify icon='material-symbols:info' width={40} height={28} color='#c7d030d9' />
      <Typography sx={{ color: theme.palette.text.primary }}>{message}</Typography>
      {children}
    </StyledInfoBanner>
  )
}
