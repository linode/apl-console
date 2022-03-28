import Policies from 'components/Policies'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useGetSettingsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading, error } = useGetSettingsQuery({ ids: ['policies'] })

  const comp = !(isLoading || error) && data?.policies && <Policies policies={data?.policies} />
  return <PaperLayout comp={comp} loading={isLoading} />
}
