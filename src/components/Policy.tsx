/* eslint-disable no-nested-ternary */
import React from 'react'
import { Policies } from '@redkubes/otomi-api-client-axios'
import EnhancedTable, { HeadCell } from './EnhancedTable'
import RLink from './Link'

interface RowProps {
  name: string
}

const getPolicyLink = (): CallableFunction => ({ name }: RowProps): React.ReactElement => {
  const link = `/policies/${name}`
  return (
    <RLink to={link} label={name}>
      {name}
    </RLink>
  )
}

interface Props {
  policies: Policies
}

export default ({ policies }: Props): React.ReactElement => {
  const policyEntries = Object.entries(policies).map((entry) => ({ name: entry[0], status: '' }))
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Policy Name',
      renderer: getPolicyLink(),
    },
    {
      id: 'status',
      label: 'Status',
    },
  ]
  return (
    <>
      <h1 data-cy='h1-policies-page'>Policies</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={policyEntries} idKey='id' />
    </>
  )
}
