import { applyAclToUiSchema, deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { cloneDeep, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetSettingsApiResponse, GetTeamApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

export const getTeamSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  team: GetTeamApiResponse,
): any => {
  const {
    cluster: { provider },
    otomi,
  } = settings
  const schema = cloneDeep(getSpec().components.schemas.Team)
  // no drone alerts for teams (yet)
  unset(schema, 'properties.alerts.properties.drone')
  deleteAlertEndpoints(schema.properties.alerts, team?.alerts)
  if (provider !== 'azure') unset(schema, 'properties.azureMonitor')
  else if (!appsEnabled.grafana || !otomi.isMultitenant)
    set(schema, 'properties.azureMonitor.title', 'Azure Monitor (disabled)')
  return schema
}

export const getTeamUiSchema = (
  appsEnabled: Record<string, any>,
  { otomi }: GetSettingsApiResponse,
  user: GetSessionApiResponse['user'],
  teamId: string,
  action: string,
): any => {
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': action !== 'create' },
    password: { 'ui:widget': 'hidden' },
    alerts: {
      receivers: {
        type: { 'ui:widget': 'hidden' },
      },
    },
  }
  if (!appsEnabled.alertmanager || !otomi.isMultitenant) {
    uiSchema.alerts['ui:title'] = 'Alerts (disabled)'
    uiSchema.alerts['ui:disabled'] = true
    uiSchema.selfService = { Team: { 'ui:enumDisabled': ['alerts'] } }
  }
  if (!appsEnabled.grafana || !otomi.isMultitenant) uiSchema.azureMonitor = { 'ui:disabled': true }

  applyAclToUiSchema(uiSchema, user, teamId, 'Team')
  return uiSchema
}

interface Props extends CrudProps {
  team?: GetTeamApiResponse
}

export default function ({ team, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings, user } = useSession()
  const [data, setData]: any = useState(team)
  useEffect(() => {
    setData(team)
  }, [team])
  // END HOOKS
  const action = team && team.id ? 'update' : 'create'
  const formData = cloneDeep(data)
  const schema = getTeamSchema(appsEnabled, settings, formData)
  const uiSchema = getTeamUiSchema(appsEnabled, settings, user, team?.id, action)
  return (
    <Form
      adminOnly
      schema={schema}
      onChange={setData}
      uiSchema={uiSchema}
      data={formData}
      resourceType='Team'
      {...other}
    />
  )
}
