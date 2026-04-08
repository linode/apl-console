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
    return h
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Serialize arrays with explode: true format (repeated keys)
        value.forEach((item) => searchParams.append(key, item))
      } else if (value !== undefined && value !== null) searchParams.append(key, String(value))
    })
    return searchParams.toString()
  },
})

let isRedirecting = false

// Wrap the base query to intercept 401/403 HTML responses from OAuth2-Proxy
// and redirect to the login page instead of showing raw HTML errors
const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error && !isRedirecting) {
    const { status, data } = result.error
    // RTK Query wraps HTML responses as PARSING_ERROR with the real HTTP status in originalStatus
    const httpStatus = 'originalStatus' in result.error ? result.error.originalStatus : status
    const isAuthError = httpStatus === 401 || httpStatus === 403
    const isHtmlResponse = typeof data === 'string' && data.includes('<!DOCTYPE html')
    if (isAuthError && isHtmlResponse) {
      isRedirecting = true
      window.location.href = `/oauth2/start?rd=${encodeURIComponent(window.location.pathname)}`
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
