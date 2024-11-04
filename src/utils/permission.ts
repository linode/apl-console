import { get } from 'lodash'
import { GetSessionApiResponse } from 'redux/otomiApi'

export function canDo(user: GetSessionApiResponse['user'], teamId: string, action: string): boolean {
  if (user.isPlatformAdmin) return true
  if (!teamId) return false
  const deniedActions = get(user, `authz.${teamId}.deniedAttributes.access`, [])
  return !deniedActions.includes(action)
}
