import React from 'react'
import PaperLayout from '../layouts/Paper'
import Setting from '../components/Setting'
import { getSettingsSchema } from '../api-spec'

export default (params) => {
  return <PaperLayout comp={<Setting propertyName='alerts' schema={getSettingsSchema('alerts')} />} />
}
