import React from 'react'
import { Policies as PoliciesType } from '@redkubes/otomi-api-client-axios'
import { useApi } from '../hooks/api'
import PaperLayout from '../layouts/Paper'
import { ApiError } from '../utils/error'
import Policy from '../components/Policy'

interface IncomingPolicies {
  policies: PoliciesType
}

export default (): React.ReactElement => {
  const [policies, policiesLoading, policiesError]: [IncomingPolicies, boolean, ApiError] = useApi('getSetting', true, [
    'policies',
  ])

  const comp = !policiesLoading && (!policiesError || policies) && <Policy policies={policies.policies} />
  return <PaperLayout comp={comp} loading={policiesLoading} />
}
