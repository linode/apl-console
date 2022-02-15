import React from 'react'
import { Policies as PoliciesType } from '@redkubes/otomi-api-client-axios'
import { ApiError } from 'utils/error'
import Policies from 'components/Policies'
import { useApi } from 'hooks/useApi'
import PaperLayout from 'layouts/Paper'

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
