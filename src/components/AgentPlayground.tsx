import React, { useEffect, useRef, useState } from 'react'
import { Alert, Box, IconButton, TextField, Typography, keyframes } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import DeleteIcon from '@mui/icons-material/Delete'
import StopIcon from '@mui/icons-material/StopCircle'
import Markdown from './Markdown'
import { Paper } from './Paper'
import Iconify from './Iconify'

const thinkingAnimation = keyframes`
  0%, 60%, 100% {
    opacity: 0.3;
  }
  30% {
    opacity: 1;
  }
`

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
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    if (messagesContainerRef.current) messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
      // Remove the empty assistant message if it exists
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage?.role === 'assistant' && !lastMessage.content) return prev.slice(0, -1)

        return prev
      })
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input.trim(), id: `user-${Date.now()}` }
    const assistantId = `assistant-${Date.now()}`
    const newMessages = [...messages, userMessage]

    // Immediately add user message and empty assistant message for thinking animation
    setMessages([...newMessages, { role: 'assistant', content: '', id: assistantId }])
    setInput('')
    setLoading(true)
    setError(null)

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Call agent service through nginx proxy to handle http and mixed-content issues
      // In development: use /agent proxy (port-forward to localhost:9099)
      // In cluster: use /teams/{teamId}/agents/{agentName} proxy (nginx routes to internal service)
      const isDev = process.env.NODE_ENV === 'development'
      const agentServiceUrl = isDev
        ? `/agent/v1/chat/completions`
        : `/teams/${teamId}/agents/${agentName}/v1/chat/completions`

      const requestBody = {
        messages: newMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        stream: true,
        model: 'rag-pipeline',
      }

      const response = await fetch(agentServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        const errorMessage = errorData?.error?.message || `Error: ${response.status}`
        throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Unknown error')
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
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
                  // Ignore JSON parse errors for malformed chunks
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
      // Don't show error if request was aborted by user
      if (err instanceof Error && err.name === 'AbortError') return

      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
    } finally {
      setLoading(false)
      abortControllerRef.current = null
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
          ref={messagesContainerRef}
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
                  {(() => {
                    // Show thinking animation for empty assistant message while loading
                    if (message.role === 'assistant' && !message.content && loading) {
                      return (
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'text.secondary',
                              animation: `${thinkingAnimation} 1.4s ease-in-out infinite`,
                            }}
                          />
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'text.secondary',
                              animation: `${thinkingAnimation} 1.4s ease-in-out 0.2s infinite`,
                            }}
                          />
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'text.secondary',
                              animation: `${thinkingAnimation} 1.4s ease-in-out 0.4s infinite`,
                            }}
                          />
                        </Box>
                      )
                    }

                    // Render assistant message with markdown
                    if (message.role === 'assistant') {
                      return (
                        <Markdown
                          readme={message.content}
                          sx={{ p: 0, boxShadow: 'none', backgroundColor: 'transparent', fontSize: '14px' }}
                        />
                      )
                    }

                    return (
                      <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                        {message.content}
                      </Typography>
                    )
                  })()}
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
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
          {loading ? (
            <IconButton onClick={handleStop} color='primary' sx={{ width: 44, height: 44 }}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton onClick={handleSend} disabled={!input.trim()} color='primary' sx={{ width: 44, height: 44 }}>
              <SendIcon />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  )
}
