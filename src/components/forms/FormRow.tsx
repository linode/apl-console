import React from 'react'
import { Box } from '@mui/material'

interface FormRowProps {
  children: React.ReactNode
  spacing?: number // spacing in pixels
}

export default function FormRow(props: FormRowProps) {
  const { children, spacing = 0 } = props

  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='flex-end'
      sx={{
        '& > *:not(:last-child)': {
          marginRight: `${spacing}px`,
        },
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
