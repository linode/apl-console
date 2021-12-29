import React from 'react'
import Policies from '../components/Policies'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

export default (): React.ReactElement => {
  const [policies, policiesLoading, policiesError]: any = useApi('getAllSettings', 'policies')

  const comp = !policiesLoading && (!policiesError || policies) && <Policies policies={policies} />
  return <PaperLayout comp={comp} loading={policiesLoading} />
}
