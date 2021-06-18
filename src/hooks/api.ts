/* eslint-disable no-restricted-globals */
import { useEffect } from 'react'
import { DefaultApi } from '@redkubes/otomi-api-client-axios'
import { LoadingHook, useLoadingValue } from '../utils'
import snack from '../utils/snack'
import { useSession, SessionContext } from '../session-context'
import { ApiError, ApiErrorUnauthorized } from '../utils/error'
import devTokens from '../devtokens'

const env = process.env
let baseUrl = `${location.protocol}//${location.host}${env.CONTEXT_PATH || ''}/api/v1`
let options: any
if (env.NODE_ENV === 'development') {
  baseUrl = `${env.API_BASE_URL || 'http://localhost:3000'}/api/v1`
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

export const client = new DefaultApi(baseUrl)

export const useApi = (method: string, active = true, args: any[] = []): ApiHook => {
  const signature = JSON.stringify(args)
  let canceled = false
  const { error, loading, setError, setValue, value } = useLoadingValue<any, ApiError>()
  const {
    user: { isAdmin },
    setDirty,
    setGlobalError,
  } = useSession()
  const checkDirty = (method: any): void => {
    ;['create', 'edit', 'update', 'delete'].forEach((prefix) => {
      if (method.indexOf(prefix) === 0) {
        setDirty(true)
      }
    })
    if (method.indexOf('deploy') === 0) {
      setDirty(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async (): Promise<any> => {
      if (!active) {
        setValue(undefined)
        return
      }
      try {
        if (!client[method]) {
          const err = `Api method does not exist: ${method}`
          setError(new ApiError(err))
          if (process.env.NODE_ENV !== 'production') {
            snack.error(err)
          } else {
            // eslint-disable-next-line no-console
            console.error(err)
          }
        } else {
          if (canceled) return
          const value = await client[method].call(client, ...args, options)
          checkDirty(method)
          setValue(value.response.body)
          if (setGlobalError) setGlobalError()
        }
      } catch (e) {
        const err = e.response?.body?.error ?? e.response?.statusMessage ?? e.message
        const statusCode = e.statusCode
        let msg = err
        if (env.NODE_ENV !== 'production') {
          msg = `Api Error[${statusCode}] calling '${method}': ${err}`
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
  }, [method, signature, active, isAdmin])

  return [value, loading, error]
}

export function useAuthz(teamId?: string): { sess: SessionContext; tid: string } {
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
