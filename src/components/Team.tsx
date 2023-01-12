import { applyAclToUiSchema, deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { cloneDeep, unset } from 'lodash'
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
  if (!otomi.hasExternalIDP) unset(schema, 'properties.oidc')
  if (!otomi.isMultitenant) unset(schema, 'properties.monitoringStack')
  if (!appsEnabled.alertmanager) unset(schema, 'properties.alerts')
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
    name: { 'ui:autofocus': true, 'ui:readonly': action !== 'create' },
    password: { 'ui:widget': 'hidden' },
    alerts: {
      receivers: {
        type: { 'ui:widget': 'hidden' },
      },
    },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'team')
  return uiSchema
}

interface Props extends CrudProps {
  team?: GetTeamApiResponse
}

export default function ({ team, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings, user } = useSession()
  const [data, setData] = useState<GetTeamApiResponse>(team)
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
      deleteDisabled={!user.isAdmin}
      resourceType='Team'
      {...other}
    />
  )
}
