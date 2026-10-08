import _Paper, { PaperProps } from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import * as React from 'react'

import { omittedProps } from '../utils/omittedProps'

import { FormHelperText } from './FormHelperText'

interface Props extends PaperProps {
  /**
   * Displays an error in red text below the Paper
   */
  error?: string

  noPaddingTop?: boolean
}

/**
 *
 * ## Overview
 *
 * Papers are surfaces that display content and actions on a single topic. They should be easy to scan for relevant and actionable information. Elements like text and images should be placed on them in a way that clearly indicates hierarchy.
 *
 * ## Usage
 * - Papers are used for grouping information.
 * - Papers allow for flexible layouts.
 *
 */
export function Paper(props: Props) {
  return (
    <>
      <StyledPaper {...props} variant={props.error ? 'outlined' : props.variant} data-qa-paper />
      {props.error && <StyledErrorText>{props.error}</StyledErrorText>}
    </>
  )
}

const StyledPaper = styled(_Paper, {
  shouldForwardProp: omittedProps(['error']),
})<Props>(({ theme, ...props }) => ({
  borderColor: props.error ? theme.palette.error.main : theme.palette.divider,
  borderRadius: 0,
  boxShadow: 'none',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontFamily: theme.font.normal,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
  padding: theme.spacing(3),
  paddingTop: props.noPaddingTop ? 0 : 20,
  marginBottom: 20,
}))

const StyledErrorText = styled(FormHelperText)(({ theme }) => ({
  color: theme.palette.error.main,
  fontFamily: theme.font.normal,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
}))
