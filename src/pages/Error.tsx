import Error from 'components/Error'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { ErrorRoute } from 'utils/error'

interface Props {
  error: ErrorRoute
}

export default function ({ error }: Props): React.ReactElement {
  const err = <Error error={error} />
  return <PaperLayout comp={err} />
}
