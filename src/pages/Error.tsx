import React from 'react'
import Error from '../components/Error'

import PaperLayout from '../layouts/Paper'

interface Props {
  code: number
}

export default ({ code }: Props): any => {
  const err = <Error code={code} />
  return <>{code === 401 ? <PaperLayout>{err}</PaperLayout> : err}</>
}
