/* eslint-disable default-param-last */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const headers = []

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  prepareHeaders: (h) => {
    headers.map(([idx, val]: [string, string]) => h.set(idx, val))
    h.set('Accept', 'application/json')
    return h
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Serialize arrays with explode: true format (repeated keys)
        value.forEach((item) => searchParams.append(key, String(item)))
      } else if (value !== undefined && value !== null) searchParams.append(key, String(value))
    })
    return searchParams.toString()
  },
})

let isRedirecting = false

const getHttpStatus = (error: FetchBaseQueryError): number | string =>
  'originalStatus' in error ? error.originalStatus : error.status

const redirectToLogin = () => {
  if (isRedirecting) return
  isRedirecting = true
  // On JWT verification failure, reload the page without clearing browser session.
  // This gives Envoy time to refresh JWKS and retry the request with fresh keys.
  // If Keycloak keys have rotated during upgrade, a brief delay allows stabilization.
  window.location.reload()
}

// Wrap the base query to intercept 401 responses from OAuth2-Proxy
// and redirect to the login page when the session has expired
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && getHttpStatus(result.error) === 401) {
    result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && getHttpStatus(result.error) === 401) {
      redirectToLogin()
      // Suspend the query so components stay in loading state until redirect completes
      return new Promise(() => {
        /* suspend until redirect */
      })
    }
  }

  return result
}

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  // keepUnusedDataFor: 0,
})
