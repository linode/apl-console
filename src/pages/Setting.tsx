import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import PaperLayout from '../layouts/Paper'
import Setting from '../components/Setting'
import { getSettingsSchema } from '../api-spec'

interface Params {
  settingId?: string
}

export default ({
  match: {
    params: { settingId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  return <PaperLayout comp={<Setting propertyName={settingId} schema={getSettingsSchema().properties[settingId]} />} />
}
