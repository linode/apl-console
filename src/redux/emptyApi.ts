/* eslint-disable default-param-last */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const headers = []

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1/',
  prepareHeaders: (h) => {
    headers.map(([idx, val]: [string, string]) => h.set(idx, val))
    return h
  },
})

// initialize an empty api service that we'll inject endpoints into later as needed
export const emptySplitApi = createApi({
  baseQuery,
  endpoints: () => ({}),
  refetchOnMountOrArgChange: true,
  // keepUnusedDataFor: 0,
})
