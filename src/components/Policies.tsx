/* eslint-disable no-nested-ternary */
import { Typography } from '@mui/material'
import { Policies } from '@redkubes/otomi-api-client-axios'
import { getPolicySchema } from 'common/api-spec'
import { useSession } from 'common/session-context'
import { map } from 'lodash'
import React from 'react'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'

interface RowProps {
  policyId: string
}

const getPolicyLink = (): CallableFunction =>
  function ({ policyId }: RowProps): React.ReactElement {
    const path = `/policies/${policyId}`
    const { title } = getPolicySchema(policyId)
    return (
      <RLink to={path} label={policyId}>
        {title}
      </RLink>
    )
  }

interface EnabledProps {
  enabled: boolean
}
const getEnabled = (gatekeeperEnabled) =>
  function ({ enabled }: EnabledProps) {
    const str = enabled ? 'yes' : 'no'
    return gatekeeperEnabled ? (
      str
    ) : (
      <Typography variant='body2' color='action.disabled'>
        {str}
      </Typography>
    )
  }
interface Props {
  policies: Policies
}

export default function ({ policies }: Props): React.ReactElement {
  const { appsEnabled } = useSession()
  const policyEntries = map(policies, (pol, policyId) => ({ policyId, ...pol }))
  const headCells: HeadCell[] = [
    {
      id: 'policyId',
      label: 'Policy',
      renderer: getPolicyLink(),
    },
    {
      id: 'enabled',
      label: 'Enabled',
      renderer: getEnabled(appsEnabled.gatekeeper),
    },
  ]
  return (
    <>
      <h1 data-cy='h1-policies-page'>Policies</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='enabled' rows={policyEntries} idKey='policyId' />
    </>
  )
}
