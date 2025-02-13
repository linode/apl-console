/* eslint-disable no-empty-pattern */
import { styled } from '@mui/material'

import { Typography } from '../Typography'

export const StyledTypography = styled(Typography, {
  label: 'StyledTypography',
})(({ theme }) => ({
  '&:hover': {
    textDecoration: 'underline',
  },
  fontSize: '1.125rem',
  fontWeight: 300,
  lineHeight: 'normal',
  textTransform: 'capitalize',
  whiteSpace: 'nowrap',
  color: theme.palette.cl.breadCrumb.crumbPath,
}))

export const StyledSlashTypography = styled(Typography, {
  label: 'StyledSlashTypography',
})(({ theme }) => ({
  color: theme.palette.cl.breadCrumb.crumbPath,
  fontSize: 20,
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
