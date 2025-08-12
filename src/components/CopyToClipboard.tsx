import { Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'

interface CopyToClipboardProps {
  text: string
  tooltipTitle?: string
  showLink?: boolean
}

function CopyToClipboard({ text, tooltipTitle = 'Copy to clipboard', showLink = false }: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {showLink && <Link to={{ pathname: text }} target='_blank' />}
      <Box sx={{ width: '30px' }}>
        {!copied ? (
          <Tooltip title={tooltipTitle}>
            <ContentCopyIcon sx={{ ml: 1, cursor: 'pointer' }} onClick={handleCopyToClipboard} />
          </Tooltip>
        ) : (
          <Tooltip title='Copied!'>
            <DoneIcon sx={{ ml: 1, cursor: 'pointer' }} />
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

export default CopyToClipboard
