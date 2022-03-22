/* eslint-disable no-restricted-globals */
import { DefaultApi } from '@redkubes/otomi-api-client-axios'
import devTokens from 'common/devtokens'
import { SessionContext, useSession } from 'common/session-context'
import useLoadingValue, { LoadingHook } from 'hooks/useLoadingValue'
import { useEffect } from 'react'
import { ApiError, ApiErrorUnauthorized } from 'utils/error'
import snack from 'utils/snack'

const baseUrl = `${location.protocol}//${location.hostname}:${location.port}/api/v1`
let options: any
if (location.hostname === 'localhost') {
  // eslint-disable-next-line no-console
  console.info('running in development mode')
  const team = location.search.includes('team') ? 'otomi' : 'admin'
  let token
  if (team !== 'admin') {
    window.localStorage.setItem('oboTeamId', `"${team}"`)
    token = devTokens.team
  } else token = devTokens.admin

  options = {
    headers: { Authorization: `Bearer ${token}` },
  }
}

export type ApiHook = LoadingHook<any, ApiError>

const client = new DefaultApi(undefined, baseUrl)

export const useAuthz = (teamId?: string): { sess: SessionContext; tid: string } => {
  const session: SessionContext = useSession()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  if (!isAdmin && teamId && teamId !== oboTeamId) throw new ApiErrorUnauthorized()

  return { sess: session, tid: teamId || oboTeamId }
}

const dirtyBunch = ['create', 'edit', 'update', 'delete', 'toggle', 'set']

export default (operationId: string, active: any | string | undefined = true, args: any[] = []): ApiHook => {
  let canceled = false
  const { error, loading, reset, setError, setValue, value } = useLoadingValue<any, ApiError>()
  const signature = `${operationId}(${args.map((a) => JSON.stringify(a)).join(',')})`
  const {
    user: { isAdmin },
    setDirty,
    setGlobalError,
  } = useSession()
  const checkDirty = (operationId: any): void => {
    dirtyBunch.forEach((prefix) => {
      if (operationId.indexOf(prefix) === 0) setDirty(true)
    })
    if (operationId.indexOf('deploy') === 0) setDirty(false)
  }
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi, @typescript-eslint/no-floating-promises
    ;(async (): Promise<any> => {
      if (!active) {
        setValue(undefined)
        return
      }
      console.log('useApi: ', signature)
      try {
        let value
        if (!client[operationId]) {
          const err = `Api operationId does not exist: ${operationId}`
          setError(new ApiError(err))
          if (location.host === 'localhost') snack.error(err)
          else {
            // eslint-disable-next-line no-console
            console.error(err)
          }
        } else {
          if (canceled) return
          value = await client[operationId].call(client, ...args, options)
          setValue(value.data)
          checkDirty(operationId)
        }
        if (setGlobalError) setGlobalError()
      } catch (e) {
        const err = e.response?.data?.error ?? e.response?.data ?? e.message
        const code = e.response?.data?.status ?? e.response?.status ?? e.code
        let msg = err
        if (location.hostname === 'localhost') {
          msg = `Api Error[${code}] calling '${operationId}': ${err}`
          // eslint-disable-next-line no-console
          console.error(e)
        }
        snack.error(msg)
        const apiError = new ApiError(err, code)
        setError(apiError)
        if (setGlobalError) setGlobalError(apiError)
      }
    })()
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canceled = true
    }
  }, [operationId, signature, active, isAdmin])

  return [active ? value : undefined, loading, error]
}
