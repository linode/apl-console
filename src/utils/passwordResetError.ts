export default function getPasswordResetErrorMessage(error: unknown, defaultMessage: string): string {
  if (typeof error !== 'object' || error === null) return defaultMessage

  if (
    'status' in error &&
    (typeof error.status === 'string' || typeof error.status === 'number') &&
    ['FETCH_ERROR', 'TIMEOUT_ERROR', 'PARSING_ERROR', 502, 503, 504].includes(error.status)
  )
    return 'The API is currently unavailable. Please try again later.'

  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    if ('message' in error.data && typeof error.data.message === 'string' && error.data.message.length > 0)
      return error.data.message
    if ('error' in error.data && typeof error.data.error === 'string' && error.data.error.length > 0)
      return error.data.error
  }

  if ('error' in error && typeof error.error === 'string' && error.error.length > 0) return error.error

  return defaultMessage
}
