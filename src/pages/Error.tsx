import React from 'react'
import Error from '../components/Error'

import MainLayout from '../layouts/Main'

interface Props {
  code: number
}

export default ({ code }: Props): any => {
  const err = <Error code={code} />
  return <>{code === 401 ? <MainLayout>{err}</MainLayout> : err}</>
}
