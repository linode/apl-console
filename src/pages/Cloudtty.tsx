import Cloudtty from 'components/Cloudtty'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'

interface Params {
  teamId?: string
}

export default function ({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  // END HOOKS
  const comp = <Cloudtty teamId={teamId} />
  return <PaperLayout loading={false} comp={comp} title={t('TITLE_WORKLOADS', { scope: getRole(teamId) })} />
}
