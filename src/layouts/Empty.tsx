import { Card, Container, styled } from '@mui/material'
import React from 'react'

const StyledPage = styled(Container)({
  backgroundColor: '#161c24',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  minWidth: '100vw',
  overflow: 'hidden',
})

const StyledCard = styled(Card)({
  backgroundColor: '#181B1F',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '4vh',
  boxSizing: 'border-box', // Ensures padding is included in width/height calculations
  minWidth: '300px', // Minimum width to ensure content visibility
  width: '50%', // Use 100% of the parent container's width
  minHeight: '370px', // Minimum height to ensure content visibility at different zoom levels
  maxHeight: '90vh', // Use a high percentage of the viewport height to ensure visibility at different zoom levels
  overflow: 'auto', // Enable scroll if the content overflows
})

interface Props {
  children?: any
  title?: string
}
export default function ({ children, title }: Props): React.ReactElement {
  return (
    <StyledPage>
      <StyledCard>{children}</StyledCard>
    </StyledPage>
  )
}
