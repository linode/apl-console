/* eslint-disable default-param-last */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-globals */
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import devTokens from 'common/devtokens'

const headers = []
if (location.hostname === 'localhost') {
  // eslint-disable-next-line no-console
  console.info('running in development mode')
  const team = location.search.includes('team') ? 'otomi' : 'admin'
  let token
  if (team !== 'admin') {
    window.localStorage.setItem('oboTeamId', `"${team}"`)
    token = devTokens.team
  } else token = devTokens.admin

  headers.push(['Authorization', `Bearer ${token}`])
}

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1/',
  prepareHeaders: (h) => {
    headers.map(([idx, val]) => h.set(idx, val))
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
