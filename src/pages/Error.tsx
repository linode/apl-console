import Error from 'components/Error'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { ErrorApi } from 'utils/error'

interface Props {
  error: ErrorApi
}

export default function ({ error }: Props): React.ReactElement {
  const err = <Error error={error} />
  return <PaperLayout comp={err} />
}
