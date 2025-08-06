import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography, TypographyProps } from './Typography'

// styled part, separated
const StyledDescription = styled(Typography)<TypographyProps>({
  color: '#ABABAB',
  marginTop: '5px',
  maxWidth: '85%',
})

// wrapper component
export function Description(props: TypographyProps) {
  return <StyledDescription {...props} />
}
