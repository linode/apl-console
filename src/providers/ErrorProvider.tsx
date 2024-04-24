import React from 'react'
import { useAppSelector } from 'redux/hooks'
import { ApiErrorGatewayTimeout } from 'utils/error'
import ErrorComponent from 'components/Error'

interface Props {
  children: any
}

export default function ErrorProvider({ children }: Props): React.ReactElement {
  const isError = useAppSelector(({ global: { error } }) => error)
  if (!isError) return children
  return <ErrorComponent error={new ApiErrorGatewayTimeout()} />
}
