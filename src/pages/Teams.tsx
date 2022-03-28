import Teams from 'components/Teams'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useGetTeamsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading, error } = useGetTeamsQuery()
  // END HOOKS
  const comp = !(isLoading || error) && data && <Teams teams={data} />
  return <PaperLayout loading={isLoading} comp={comp} />
}
