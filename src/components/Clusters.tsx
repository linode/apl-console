import React from 'react'
import { Settings } from '@redkubes/otomi-api-client-axios'
import MuiLink from './MuiLink'
import EnhancedTable, { HeadCell } from './EnhancedTable'

interface Props {
  settings: Settings
}

export default ({ settings }: Props): React.ReactElement => {
  const headCells: HeadCell[] = [
    {
      id: 'url',
      label: 'Url',
      renderer: (url: string) => (
        <MuiLink href={url} target='_blank' rel='noopener'>
          {url}
        </MuiLink>
      ),
    },
  ]
  return (
    <>
      <h1 data-cy='h1-clusters-page'>Clusters</h1>
      <EnhancedTable
        disableSelect
        headCells={headCells}
        orderByStart='name'
        rows={settings.otomiInstanceUrls}
        idKey='id'
      />
    </>
  )
}
