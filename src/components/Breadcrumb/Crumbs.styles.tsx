/* eslint-disable no-empty-pattern */
import { styled } from '@mui/material'

import { Typography } from '../Typography'

export const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  '&:hover': {
    textDecoration: 'underline',
  },
  fontFamily: '"Nunito Sans", sans-serif',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: 'normal',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  color: theme.palette.cl.breadCrumb.crumbPath,
}))

export const StyledSlashTypography = styled(Typography, {
  label: 'StyledSlashTypography',
})(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontFamily: theme.typography.fontFamily,
  fontSize: '14px',
  lineHeight: '20px',
  marginLeft: 2,
  marginRight: 2,
}))

export const StyledDiv = styled('div', { label: 'StyledDiv' })({
  alignItems: 'center',
  display: 'flex',
  '& *': {
    textDecoration: 'none',
  },
})
