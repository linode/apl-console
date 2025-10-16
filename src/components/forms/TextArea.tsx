import React, { useEffect, useRef } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Box } from '@mui/material'
import { InputLabel } from 'components/InputLabel'
import TextAreaLock from 'components/forms/TextAreaLock'

const useStyles = makeStyles<{ disabled?: boolean; error?: boolean }>()((theme: Theme, { disabled, error }) => {
  const disabledStyles = disabled
    ? {
        cursor: 'not-allowed',
        backgroundColor: theme.palette.cm.disabledBackground,
        borderColor: theme.palette.cm.disabledBorder,
        color: theme.palette.cm.disabledText,
      }
    : {}
  const errorStyles = error
    ? {
        borderColor: 'red',
      }
    : {}
  return {
    inputLabel: {
      color: theme.palette.cl.text.title,
      marginBottom: theme.spacing(2),
    },
    textarea: {
      backgroundColor: theme.palette.cm.textBox,
      color: theme.palette.cl.text.title,
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.cm.inputBorder}`,
      boxSizing: 'border-box',
      overflow: 'hidden',
      fontFamily: 'monospace',
      fontSize: '12px',
      resize: disabled ? 'none' : 'both',
      display: 'inline-block',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
      minWidth: '200px',
      minHeight: '34px',
      maxWidth: '850px',
      maxHeight: '800px',
      width: 'auto',
      height: 'auto',
      ...disabledStyles,
      ...errorStyles,
    },
  }
})

export interface AutoResizableTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  label?: string
  minRows?: number
  maxRows?: number
  minWidth?: number | string
  maxWidth?: number | string
  minHeight?: number | string
  maxHeight?: number | string
  style?: React.CSSProperties
  error?: boolean
  isEncrypted?: boolean
}

export function AutoResizableTextarea({
  label = '',
  minRows = 1,
  maxRows = 40,
  minWidth = 200,
  maxWidth = 850,
  minHeight = 34,
  maxHeight = 800,
  style,
  error = false,
  isEncrypted,
  onInput,
  onPaste,
  onChange,
  ...rest
}: AutoResizableTextareaProps) {
  const [showLock, setShowLock] = React.useState(!!(isEncrypted && rest.value && !rest.disabled))
  const [value, setValue] = React.useState(isEncrypted && rest.value ? '****' : rest.value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { classes, cx } = useStyles({
    disabled: textareaRef?.current?.disabled,
    error,
  })
  const rulerRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (showLock) textareaRef.current.disabled = true
    const ruler = document.createElement('span')
    ruler.style.position = 'absolute'
    ruler.style.visibility = 'hidden'
    ruler.style.whiteSpace = 'pre'
    document.body.appendChild(ruler)
    rulerRef.current = ruler

    return () => {
      if (rulerRef.current) document.body.removeChild(rulerRef.current)
    }
  }, [])

  const getCalculatedWidth = (value: string) => {
    const textarea = textareaRef.current
    const ruler = rulerRef.current
    if (!textarea || !ruler) return 0
    const lines = value.split('\n')
    const style = getComputedStyle(textarea)
    ruler.style.font = style.font
    ruler.style.fontSize = style.fontSize
    ruler.style.fontFamily = style.fontFamily
    let maxWidth = 0
    lines.forEach((line) => {
      ruler.textContent = line || ' '
      const lineWidth = ruler.offsetWidth
      maxWidth = Math.max(maxWidth, lineWidth)
    })
    const calculatedWidth = maxWidth + 20 // Add padding for better appearance
    return calculatedWidth
  }

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
    const calculatedWidth = getCalculatedWidth(el.value)
    if (calculatedWidth > Number(minWidth)) {
      if (calculatedWidth > Number(maxWidth)) el.style.width = `100%`
      else el.style.width = `${calculatedWidth}px`
    } else el.style.minWidth = typeof minWidth === 'number' ? `${minWidth}px` : minWidth

    if (maxWidth !== undefined && maxWidth !== null)
      el.style.maxWidth = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth
    else el.style.maxWidth = '100%'

    // Set height based on scrollHeight, but clamp to min/max
    let newHeight = el.scrollHeight
    if (parseInt(maxH, 10) && newHeight > parseInt(maxH, 10)) newHeight = parseInt(maxH, 10)
    if (parseInt(minH, 10) && newHeight < parseInt(minH, 10)) newHeight = parseInt(minH, 10)
    el.style.height = `${newHeight}px`
  }

  useEffect(() => {
    adjustSize()
  }, [rest.value])

  // Sync internal value state with external value prop
  useEffect(() => {
    if (!showLock && rest.value !== value) setValue(rest.value)
  }, [rest.value, showLock])

  return (
    <Box>
      <InputLabel
        className={classes.inputLabel}
        sx={{
          fontWeight: 'bold',
          fontSize: '14px',
          visibility: label ? 'visible' : 'hidden',
          marginTop: label ? '16px' : '0px',
        }}
      >
        {label}
      </InputLabel>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
        }}
      >
        <textarea
          {...rest}
          ref={textareaRef}
          className={cx(classes.textarea)}
          rows={minRows}
          onInput={(e) => {
            onInput?.(e)
            adjustSize()
          }}
          onPaste={(e) => {
            onPaste?.(e)
            setTimeout(adjustSize, 0)
          }}
          onChange={(e) => {
            onChange?.(e)
            setValue(e.target.value)
            adjustSize()
          }}
          disabled={rest.disabled}
          value={value}
        />
        {showLock && (
          <TextAreaLock
            onUnlock={() => {
              setValue('')
              setTimeout(() => {
                setShowLock(false)
              }, 1000)
              textareaRef.current.disabled = false
              textareaRef.current.focus()
            }}
          />
        )}
      </Box>
    </Box>
  )
}
