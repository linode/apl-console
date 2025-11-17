/* eslint-disable default-param-last */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const headers = []

const baseQuery = fetchBaseQuery({
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

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  // keepUnusedDataFor: 0,
})
