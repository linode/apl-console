import { BoxProps, Box as MuiBox } from '@mui/material'
import React from 'react'

/**
 * The Box component serves as a wrapper for creating simple layouts or styles.
 * It uses a `<div />` unless unless you change it with the `component` prop
 */
export function Box(props: BoxProps) {
  return <MuiBox {...props} />
}

export type { BoxProps }
