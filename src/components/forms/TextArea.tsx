import React, { useLayoutEffect, useRef } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Box } from '@mui/material'
import { InputLabel } from 'components/InputLabel'

const useStyles = makeStyles()((theme: Theme) => ({
  inputLabel: {
    color: theme.palette.cl.text.title,
    marginBottom: theme.spacing(2),
  },
  textarea: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.cl.text.title,
    padding: theme.spacing(1),
    border: `1px solid ${theme.palette.cm.inputBorder}`,
    boxSizing: 'border-box',
    fontSize: '1rem',
    fontFamily: theme.typography.fontFamily,
    width: '100%',
    resize: 'both',
    display: 'block',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
}))

export interface AutoResizableTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: string
  minRows?: number
  maxRows?: number
  minWidth?: number | string
  maxWidth?: number | string
  minHeight?: number | string
  maxHeight?: number | string
  style?: React.CSSProperties
}

export function AutoResizableTextarea({
  label = '',
  minRows = 1,
  maxRows = 40,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight = 800,
  style,
  onInput,
  onPaste,
  onChange,
  ...rest
}: AutoResizableTextareaProps) {
  const { classes, cx } = useStyles()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustSize = () => {
    const el = textareaRef.current
    if (!el) return

    // Reset dimensions to measure content size
    el.style.width = 'auto'
    el.style.height = 'auto'

    // Calculate row height
    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight || '16', 10)
    let rows = el.value.split('\n').length
    let minH: string
    if (minHeight) minH = typeof minHeight === 'number' ? `${minHeight}px` : minHeight
    else minH = `${minRows * lineHeight}px`

    let maxH: string
    if (maxHeight) maxH = typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
    else maxH = `${maxRows * lineHeight}px`

    if (rows < minRows) rows = minRows

    // Set min/max height
    el.style.minHeight = minH
    el.style.maxHeight = maxH

    // Set min/max width
    if (el.value.includes('BEGIN CERTIFICATE')) el.style.minWidth = '800px'
    else el.style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth
    if (maxWidth !== undefined && maxWidth !== null)
      el.style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    else el.style.maxWidth = '100%'

    // Set height based on scrollHeight, but clamp to min/max
    let newHeight = el.scrollHeight
    if (parseInt(maxH, 10) && newHeight > parseInt(maxH, 10)) newHeight = parseInt(maxH, 10)
    if (parseInt(minH, 10) && newHeight < parseInt(minH, 10)) newHeight = parseInt(minH, 10)
    el.style.height = `${newHeight}px`
  }

  useLayoutEffect(() => {
    adjustSize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.value])

  return (
    <Box sx={{}}>
      <InputLabel
        className={classes.inputLabel}
        sx={{
          fontWeight: 'bold',
          fontSize: '14px',
          visibility: label ? 'visible' : 'hidden',
          marginTop: label ? '16px' : '8px',
        }}
      >
        {label}
      </InputLabel>
      <textarea
        {...rest}
        ref={textareaRef}
        className={cx(classes.textarea)}
        style={style}
        rows={minRows}
        onInput={(e) => {
          onInput?.(e)
          adjustSize()
        }}
        onPaste={(e) => {
          onPaste?.(e)
          setTimeout(adjustSize, 0)
        }}
        onChange={onChange}
      />
    </Box>
  )
}
