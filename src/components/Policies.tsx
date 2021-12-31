/* eslint-disable no-nested-ternary */
import React from 'react'
import { Policies } from '@redkubes/otomi-api-client-axios'
import { map } from 'lodash'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'
import { getPolicySchema } from '../api-spec'

interface RowProps {
  policyId: string
}

const getPolicyLink = (): CallableFunction => ({ policyId }: RowProps): React.ReactElement => {
  const link = `/policies/${policyId}`
  const title = getPolicySchema(policyId).title
  return (
    <RLink to={link} label={policyId}>
      {title}
    </RLink>
  )
}

interface Props {
  policies: Policies
}

export default ({ policies }: Props): React.ReactElement => {
  const policyEntries = map(policies, (pol, policyId) => {
    return { policyId, ...pol }
  })
  const headCells: HeadCell[] = [
    {
      id: 'policyId',
      label: 'Policy',
      renderer: getPolicyLink(),
    },
    {
      id: 'enabled',
      label: 'Enabled',
      renderer: (pol) => (pol.enabled ? 'yes' : 'no'),
    },
  ]
  return (
    <>
      <h1 data-cy='h1-policies-page'>Policies</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='enabled' rows={policyEntries} idKey='policyId' />
    </>
  )
}
