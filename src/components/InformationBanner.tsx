import { Box, SxProps, Typography, styled, useTheme } from '@mui/material'
import React from 'react'
import Iconify from './Iconify'

type InformationBannerType = 'info' | 'error'

const StyledInfoBanner = styled(Box)<{
  small?: boolean
  type: InformationBannerType
}>(({ theme, small, type }) => ({
  // eslint-disable-next-line no-nested-ternary
  backgroundColor: type === 'error' ? (theme.palette.mode === 'light' ? '#ff002540' : '#722e38b5') : '#f2f2894d',
  padding: small ? '5px' : '10px',
  border: `1px solid ${type === 'error' ? '#d32f2f' : '#d4d402'}`,
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
  type?: InformationBannerType
}

export default function InformationBanner({ message, children, small, sx, type = 'info' }: Props) {
  const theme = useTheme()

  const icon = type === 'error' ? 'material-symbols:error-rounded' : 'material-symbols:info'

  const iconColor = type === 'error' ? '#d32f2f' : '#c7d030d9'

  const width = type === 'error' ? 30 : 40

  return (
    <StyledInfoBanner small={small} type={type} sx={sx}>
      <Iconify icon={icon} width={width} height={28} color={iconColor} />
      <Typography sx={{ color: theme.palette.text.primary, ml: 1 }}>{message}</Typography>
      {children}
    </StyledInfoBanner>
  )
}
