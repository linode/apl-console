import { get } from 'lodash'
import {
  ActivateLicenseApiResponse,
  GetMetricsApiResponse,
  GetSessionApiResponse,
  GetTeamApiResponse,
} from 'redux/otomiApi'

export function canDo(
  user: GetSessionApiResponse['user'],
  team: GetTeamApiResponse | undefined,
  action: string,
  initialPermission?: boolean | undefined,
): boolean {
  if (initialPermission !== undefined) return initialPermission
  if (user.isAdmin) return true
  if (!team.id) return false
  const deniedActions = get(user, `authz.${team?.id}.deniedAttributes.Team`, [])
  const access = team?.selfService?.access
  switch (action) {
    case 'shell':
    case 'downloadKubeConfig':
    case 'downloadDockerConfig':
    case 'downloadCertificateAuthority':
      if (access) return access.includes(action)
      return !deniedActions.includes(action)
    default:
      return !deniedActions.includes(action)
  }
}

export function createCapabilities(currentAmount: number, licenseCapabilites: number | undefined): boolean {
  if (!licenseCapabilites) return false
  if (currentAmount < licenseCapabilites) return true
  return false
}

export function canCreateAdditionalResource(
  resourceType: string,
  metrics: GetMetricsApiResponse | undefined,
  license: ActivateLicenseApiResponse | undefined,
): boolean {
  if (!license || !metrics) return false
  switch (resourceType) {
    case 'service':
      return metrics.otomi_services < license.body.capabilities.services
    case 'workload':
      return metrics.otomi_workloads < license.body.capabilities.workloads
    case 'team':
      return metrics.otomi_teams < license.body.capabilities.teams
    case 'project':
      return (
        metrics.otomi_services < license.body.capabilities.services &&
        metrics.otomi_workloads < license.body.capabilities.workloads
      )
    default:
      console.warn(`Unknown resource type '${resourceType}'`)
      return false
  }
}
