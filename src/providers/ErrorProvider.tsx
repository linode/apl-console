import React from 'react'
import { useAppSelector } from 'redux/hooks'
import { ApiErrorAlreadyExists, ApiErrorGatewayTimeout } from 'utils/error'
import ErrorComponent from 'components/Error'

interface Props {
  children: any
}

export default function ErrorProvider({ children }: Props): React.ReactElement {
  const isError = useAppSelector(({ global: { error } }) => error)
  if (!isError) return children
  const error =
    isError.status === 409
      ? new ApiErrorAlreadyExists((isError?.data?.error as string) || 'Resource already exists')
      : new ApiErrorGatewayTimeout()
  return <ErrorComponent error={error} />
}
