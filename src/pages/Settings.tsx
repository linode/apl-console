import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Settings from '../components/Settings'

const doNothing = () => {
  const something = 'nothing'
}

interface Params {
  teamId?: string
}

export default ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const comp = <Settings onSubmit={doNothing} />
  return <PaperLayout comp={comp} />
}
