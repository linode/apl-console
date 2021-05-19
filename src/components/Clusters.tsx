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
      renderer: (cluster: any) => {
        const { url, name } = cluster
        return (
          <MuiLink href={url} target='_blank' rel='noopener'>
            {name}
          </MuiLink>
        )
      },
    },
  ]
  return (
    <>
      <h1 data-cy='h1-clusters-page'>Clusters</h1>
      <EnhancedTable disableSelect headCells={headCells} orderByStart='name' rows={settings.clusters} idKey='id' />
    </>
  )
}
