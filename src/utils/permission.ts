import get from 'lodash/get'
import { ActivateLicenseApiResponse, GetMetricsApiResponse, GetSessionApiResponse } from 'redux/otomiApi'

export default (user: GetSessionApiResponse['user'], teamId: string | undefined, action): boolean => {
  if (user.isAdmin) return true
  if (!teamId) return false
  const deniedActions = get(user, `authz.${teamId}.deniedAttributes.Team`, [])
  return !deniedActions.includes(action)
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
