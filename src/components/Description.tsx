import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from './Typography'

const StyledDescription = styled(Typography)<TypographyProps>({
  color: '#ABABAB',
  marginTop: '5px',
  maxWidth: '85%',
})

export function Description(props: TypographyProps) {
  return <StyledDescription {...props} />
}
