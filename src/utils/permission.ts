import get from 'lodash/get'
import { GetSessionApiResponse } from 'redux/otomiApi'

export default (user: GetSessionApiResponse['user'], teamId: string | undefined, action): boolean => {
  if (!teamId) return false
  if (user.isAdmin) return true
  const deniedActions = get(user, `authz.${teamId}.deniedAttributes.Team`, [])
  return !deniedActions.includes(action)
}
