import React from 'react'
import Error from '../components/Error'

import PaperLayout from '../layouts/Paper'

interface Props {
  code: number
  message?: string
}

export default (props: Props) => {
  const { code, message } = props
  const error = <Error code={code} msg={message} />
  return <>{code === 401 ? error : <PaperLayout comp={error} />}</>
}
