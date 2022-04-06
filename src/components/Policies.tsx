/* eslint-disable no-nested-ternary */
import { Typography } from '@mui/material'
import { getPolicySchema } from 'common/api-spec'
import { map } from 'lodash'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { GetSettingsApiResponse } from 'redux/otomiApi'
import { HeadCell } from './EnhancedTable'
import RLink from './Link'
import ListTable from './ListTable'

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
  policies: GetSettingsApiResponse['policies']
}

export default function ({ policies }: Props): React.ReactElement {
  const { appsEnabled } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const policyEntries = map(policies, (pol, policyId) => ({ policyId, ...pol }))
  const headCells: HeadCell[] = [
    {
      id: 'policyId',
      label: t('Policy'),
      renderer: getPolicyLink(),
    },
    {
      id: 'enabled',
      label: t('Enabled'),
      renderer: getEnabled(appsEnabled.gatekeeper),
    },
  ]
  return (
    <ListTable
      headCells={headCells}
      orderByStart='enabled'
      rows={policyEntries}
      idKey='policyId'
      resourceType='Policy'
      hasTeamScope={false}
    />
  )
}
