import { applyAclToUiSchema, deleteAlertEndpoints, getSpec } from 'common/api-spec'
import { cloneDeep, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetSessionApiResponse, GetSettingsApiResponse, GetTeamApiResponse, useGetTeamsQuery } from 'redux/otomiApi'
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
  if (!appsEnabled.opencost) unset(schema, 'properties.billingAlertQuotas')
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
  if (!appsEnabled.alertmanager) {
    uiSchema.alerts['ui:title'] = 'Alerts (disabled)'
    uiSchema.alerts['ui:disabled'] = true
    uiSchema.selfService = { Team: { 'ui:enumDisabled': ['alerts'] } }
  }
  if (!appsEnabled.grafana) uiSchema.azureMonitor = { 'ui:disabled': true }
  if (!appsEnabled.velero) uiSchema.azureMonitor = { 'ui:disabled': true }

  applyAclToUiSchema(uiSchema, user, teamId, 'team')
  return uiSchema
}

interface Props extends CrudProps {
  team?: GetTeamApiResponse
  diffReceivers: string[]
  setDiffReceivers: (receivers: string[]) => void
}

export default function ({ team, diffReceivers, setDiffReceivers, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings, user } = useSession()
  const [data, setData] = useState<GetTeamApiResponse>(team)
  useEffect(() => {
    setData({ ...team, alerts: { receivers: formData?.alerts?.receivers || ['none'] } })
  }, [team])
  useEffect(() => {
    const { receivers } = schema.properties.alerts.properties
    const allItems = receivers.items.enum
    const diff = allItems.filter((receiver) => !data?.alerts?.receivers?.includes(receiver))
    setDiffReceivers(diff)
  }, [data])
  // END HOOKS
  const action = team && team.id ? 'update' : 'create'
  const formData = cloneDeep(data)
  const schema = getTeamSchema(appsEnabled, settings, formData)
  const getDynamicUiSchema = () => {
    const uiSchema = getTeamUiSchema(appsEnabled, settings, user, team?.id, action)
    diffReceivers.forEach((receiver) => {
      uiSchema.alerts[receiver] = { 'ui:widget': 'hidden' }
    })
    return uiSchema
  }
  const uiSchema = getDynamicUiSchema()
  const teams = useGetTeamsQuery()
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
