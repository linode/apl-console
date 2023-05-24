import get from 'lodash/get'
import { GetSessionApiResponse } from 'redux/otomiApi'

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
