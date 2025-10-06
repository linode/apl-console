import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, CircularProgress, IconButton, TextField, Typography } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import { Paper } from './Paper'
import Iconify from './Iconify'

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

interface AgentPlaygroundProps {
  teamId: string
  agentName: string
}

export function AgentPlayground({ teamId, agentName }: AgentPlaygroundProps): React.ReactElement {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim(), id: `user-${Date.now()}` }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/alpha/teams/${teamId}/agents/${agentName}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((msg) => ({ role: msg.role, content: msg.content })),
          stream: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        const errorMessage = errorData?.error?.message || `Error: ${response.status}`
        throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Unknown error')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      const assistantId = `assistant-${Date.now()}`

      if (reader) {
        // Add empty assistant message that we'll update
        setMessages([...newMessages, { role: 'assistant', content: '', id: assistantId }])

        // Process streaming response
        const processStream = async () => {
          let accumulatedContent = ''
          // eslint-disable-next-line no-constant-condition
          while (true) {
            // eslint-disable-next-line no-await-in-loop
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            // eslint-disable-next-line no-loop-func
            lines.forEach((line) => {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') return

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    accumulatedContent += content
                    const currentContent = accumulatedContent
                    setMessages((prev) => {
                      const updated = [...prev]
                      const lastIndex = updated.length - 1
                      if (lastIndex >= 0 && updated[lastIndex].id === assistantId)
                        updated[lastIndex] = { ...updated[lastIndex], content: currentContent }
                      return updated
                    })
                  }
                } catch {
                  // Skip invalid JSON
                }
              }
            })
          }
        }

        await processStream()
      } else {
        // Non-streaming response
        const data = await response.json()
        const assistantContent = data.choices?.[0]?.message?.content || 'No response'
        setMessages([...newMessages, { role: 'assistant', content: assistantContent, id: assistantId }])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      // eslint-disable-next-line no-console
      console.error('Chat error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Paper sx={{ mt: 10 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '600px' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant='h6'>Agent Playground</Typography>
          <IconButton onClick={handleClear} disabled={messages.length === 0 || loading} size='small' color='error'>
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            backgroundColor: 'background.default',
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Iconify icon='material-symbols:robot-2-outline' sx={{ fontSize: 24 }} />
              <Typography sx={{ ml: 1 }} color='text.secondary'>
                Ask your agent a question to start evaluating.
              </Typography>
            </Box>
          ) : (
            messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: message.role === 'user' ? 'primary.main' : 'action.hover',
                    color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant='caption' sx={{ fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                    {message.role === 'user' ? 'You' : 'Agent'}
                  </Typography>
                  <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {message.content}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Error Display */}
        {error && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Input Area */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Type your message...'
            disabled={loading}
            variant='outlined'
            size='small'
          />
          <IconButton onClick={handleSend} disabled={!input.trim() || loading} color='primary'>
            {loading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}
