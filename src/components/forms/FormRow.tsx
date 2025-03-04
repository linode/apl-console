import React from 'react'
import { Box, SxProps } from '@mui/material'

interface FormRowProps {
  children: React.ReactNode
  spacing?: number // spacing in pixels
  sx?: SxProps
}

export default function FormRow(props: FormRowProps) {
  const { children, spacing = 0, sx } = props

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='flex-end'
      sx={{
        '& > *:not(:last-child)': {
          marginRight: `${spacing}px`,
        },
        ...sx,
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child?.type === 'IconButton' ? (
          // Directly render IconButton to apply its own alignSelf flex behavior
          <Box sx={{ alignSelf: 'flex-end' }}>{child}</Box>
        ) : (
          <Box>{child}</Box> // Wrap other children normally
        ),
      )}
    </Box>
  )
}
