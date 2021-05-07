import React from 'react'
import Error from '../components/Error'

import PaperLayout from '../layouts/Paper'
import { useSession } from '../session-context'
import { ApiError } from '../utils/error'

interface Props {
  code: number
  message?: string
}

export default (props: Props): React.ReactElement => {
  const { code, message } = props
  const { setGlobalError } = useSession()
  setGlobalError(new ApiError(message, code))
  const error = <Error />
  return code === 401 ? error : <PaperLayout comp={error} />
}
