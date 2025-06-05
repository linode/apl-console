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
      alignItems='baseline'
      sx={{
        '& > *:not(:last-child)': {
          marginRight: `${spacing}px`,
        },
        ...sx,
      }}
    >
      {React.Children.map(children, (child) => {
        const childSx = (child as React.ReactElement)?.props?.sx || {}
        if (React.isValidElement(child) && child?.type === 'IconButton')
          return <Box sx={{ alignSelf: 'flex-end' }}>{child}</Box>
        return <Box sx={{ ...childSx }}>{child}</Box>
      })}
    </Box>
  )
}
