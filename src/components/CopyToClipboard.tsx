import { Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

interface CopyToClipboardProps {
  text: string
  tooltipTitle?: string
  visible?: boolean
}

function CopyToClipboard({ text, tooltipTitle = 'Copy to clipboard', visible = true }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <Box
      sx={{
        width: 30,
        minWidth: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: visible ? 'visible' : 'hidden',
      }}
    >
      <Tooltip title={copied ? 'Copied!' : tooltipTitle}>
        <ContentCopyIcon sx={{ cursor: 'pointer', fontSize: 18 }} onClick={handleCopyToClipboard} />
      </Tooltip>
    </Box>
  )
}

export default CopyToClipboard
