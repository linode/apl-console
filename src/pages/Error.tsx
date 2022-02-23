import { useSession } from 'common/session-context'
import Error from 'components/Error'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { ApiError } from 'utils/error'

interface Props {
  code: number
  message?: string
}

export default function (props: Props): React.ReactElement {
  const { code, message } = props
  const { setGlobalError } = useSession()
  setGlobalError(new ApiError(message, code))
  const error = <Error />
  return code === 401 ? error : <PaperLayout comp={error} />
}
