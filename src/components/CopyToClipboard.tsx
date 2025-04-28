import { Box, Tooltip } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DoneIcon from '@mui/icons-material/Done'

interface Target {
  webhookUrl: string
}

function CopyToClipboard({ target }: { target: Target }) {
  const [copied, setCopied] = useState(false)

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(target.webhookUrl)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Link to={{ pathname: target.webhookUrl }} target='_blank' />
      <Box sx={{ width: '30px' }}>
        {!copied ? (
          <Tooltip title='Copy to clipboard'>
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
