import React, { useLayoutEffect, useRef } from 'react'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'

const useStyles = makeStyles()((theme: Theme) => ({
  textarea: {
    minWidth: '300px',
    minHeight: '200px',
    maxWidth: '700px',
    maxHeight: '800px',
    backgroundColor: 'rgb(52, 52, 56)',
    color: 'white',
    padding: theme.spacing(1),
    border: '1px solid #555',
    boxSizing: 'border-box',
    overflow: 'hidden',
    resize: 'auto',
    display: 'inline-block',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    fontFamily: 'monospace',
    fontSize: '12px',
    width: 'auto',
    height: 'auto',
  },
}))

export type AutoResizableTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function AutoResizableTextarea(props: AutoResizableTextareaProps) {
  const { classes, cx } = useStyles()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { style, onInput, onPaste, ...rest } = props

  const adjustSize = () => {
    const el = textareaRef.current
    if (!el) return

    // Reset dimensions to measure content size
    el.style.width = 'auto'
    el.style.height = 'auto'

    // Temporarily disable wrapping to measure full content width
    const prevWhiteSpace = el.style.whiteSpace
    el.style.whiteSpace = 'pre'
    const contentWidth = el.scrollWidth + 10

    // Restore wrapping and apply width
    el.style.whiteSpace = prevWhiteSpace || 'pre-wrap'
    el.style.width = `${contentWidth}px`

    // Measure and apply height with new width
    const contentHeight = el.scrollHeight + 5
    el.style.height = `${contentHeight}px`
  }

  useLayoutEffect(() => {
    adjustSize()
  }, [props.value])

  return (
    <textarea
      {...rest}
      ref={textareaRef}
      className={cx(classes.textarea)}
      style={style}
      onInput={(e) => {
        onInput?.(e)
        adjustSize()
      }}
      onPaste={(e) => {
        onPaste?.(e)
        setTimeout(adjustSize, 0)
      }}
    />
  )
}
