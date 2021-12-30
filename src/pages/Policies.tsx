import React from 'react'
import { Policies as PoliciesType } from '@redkubes/otomi-api-client-axios'
import Policies from '../components/Policies'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { ApiError } from '../utils/error'

interface IncomingPolicies {
  policies: PoliciesType
}

export default (): React.ReactElement => {
  const [policies, policiesLoading, policiesError]: [IncomingPolicies, boolean, ApiError] = useApi('getSetting', true, [
    'policies',
  ])

  const comp = !policiesLoading && (!policiesError || policies) && <Policies policies={policies.policies} />
  return <PaperLayout comp={comp} loading={policiesLoading} />
}
