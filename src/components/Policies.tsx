/* eslint-disable no-nested-ternary */
import React from 'react'
import { Policies } from '@redkubes/otomi-api-client-axios'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface Props {
  policies: Policies
}

// TODO: https://github.com/redkubes/otomi-core/discussions/475
export default ({ policies }: Props): React.ReactElement => {
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: 'Policy Name',
    },
    {
      id: 'status',
      label: 'Status',
    },
  ]
  return (
    <>
      <h1 data-cy='h1-services-page'>Policies</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={[]} idKey='id' />
    </>
  )
}
