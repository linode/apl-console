/* eslint-disable no-restricted-globals */
import { useEffect } from 'react'
import { DefaultApi } from '@redkubes/otomi-api-client-axios'
import useLoadingValue, { LoadingHook } from 'hooks/useLoadingValue'
import snack from 'utils/snack'
import devTokens from 'common/devtokens'
import { useSession, SessionContext } from 'common/session-context'
import { ApiError, ApiErrorUnauthorized } from 'utils/error'

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
  } else {
    token = devTokens.admin
  }
  options = {
    headers: { Authorization: `Bearer ${token}` },
  }
}

export type ApiHook = LoadingHook<any, ApiError>

const client = new DefaultApi(baseUrl)

export const useAuthz = (teamId?: string): { sess: SessionContext; tid: string } => {
  const session: SessionContext = useSession()
  const {
    user: { isAdmin },
    oboTeamId,
  } = session
  if (!isAdmin && teamId && teamId !== oboTeamId) {
    throw new ApiErrorUnauthorized()
  }
  return { sess: session, tid: teamId || oboTeamId }
}

export default (operationId: string, active: boolean | string | undefined = true, args: any[] = []): ApiHook => {
  const signature = JSON.stringify(args)
  let canceled = false
  const { error, loading, setError, setValue, value } = useLoadingValue<any, ApiError>()
  const {
    user: { isAdmin },
    setDirty,
    setGlobalError,
  } = useSession()
  const checkDirty = (operationId: any): void => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;['create', 'edit', 'update', 'delete'].forEach(prefix => {
      if (operationId.indexOf(prefix) === 0) {
        setDirty(true)
      }
    })
    if (operationId.indexOf('deploy') === 0) {
      setDirty(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi, @typescript-eslint/no-floating-promises
    ;(async (): Promise<any> => {
      if (!active) {
        setValue(undefined)
        return
      }
      try {
        let value
        if (!client[operationId]) {
          const err = `Api operationId does not exist: ${operationId}`
          setError(new ApiError(err))
          if (location.host === 'localhost') {
            snack.error(err)
          } else {
            // eslint-disable-next-line no-console
            console.error(err)
          }
        } else {
          if (canceled) return
          value = await client[operationId].call(client, ...args, options)
          setValue(value.response.body)
          checkDirty(operationId)
        }
        if (setGlobalError) setGlobalError()
      } catch (e) {
        const err = e.response?.body?.error ?? e.response?.statusMessage ?? e.message
        const { statusCode } = e
        let msg = err
        if (location.host === 'localhost') {
          msg = `Api Error[${statusCode}] calling '${operationId}': ${err}`
          // eslint-disable-next-line no-console
          console.error(e)
        }
        snack.error(msg)
        const apiError = new ApiError(err, statusCode)
        setError(apiError)
        if (setGlobalError) setGlobalError(apiError)
      }
    })()
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      canceled = true
    }
  }, [operationId, signature, active, isAdmin])

  return [value, loading, error]
}
