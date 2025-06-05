import _Divider, { DividerProps as _DividerProps } from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import * as React from 'react'

import { omittedProps } from '../utils/omittedProps'

export interface DividerProps extends _DividerProps {
  spacingBottom?: number
  spacingTop?: number
}

export function Divider(props: DividerProps) {
  return <StyledDivider {...props} />
}

const StyledDivider = styled(_Divider, {
  label: 'StyledDivider',
  shouldForwardProp: omittedProps(['spacingTop', 'spacingBottom']),
})<DividerProps>(({ theme, spacingTop = '30px', spacingBottom = '30px' }) => ({
  marginBottom: spacingBottom,
  marginTop: spacingTop,
}))
