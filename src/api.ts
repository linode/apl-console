import axios from 'axios'
import OpenAPIClientAxios from 'openapi-client-axios'

const env = process.env

// let baseUrl = 'http://127.0.0.1:8080/v1'
const baseUrl = `${env.PUBLIC_URL || ''}/api/v1`
let axiosConfigDefaults = {
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Auth-Group': undefined,
    'Auth-User': undefined,
  },
}
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.info('running in development mode')
  // eslint-disable-next-line no-restricted-globals
  const team = location.search.includes('team') ? new URLSearchParams(location.search).get('team') : 'admin'
  axiosConfigDefaults = {
    withCredentials: true,
    headers: {
      'Cache-Control': 'no-cache',
      'Auth-Group': team,
      'Auth-User': team === 'admin' ? 'bob.admin@otomi.cloud' : `joe.team@otomi.cloud`,
    },
  }
}

function getClient(apiDefinition): any {
  // eslint-disable-next-line no-param-reassign
  apiDefinition.servers = [
    {
      url: baseUrl,
    },
  ]

  const api = new OpenAPIClientAxios({
    definition: apiDefinition,
    axiosConfigDefaults,
  })

  return api.initSync()
}

async function getApiDefinition(): Promise<any> {
  const url = `${baseUrl}/apiDocs`

  return axios.get(url)
}

export { getApiDefinition }
export default getClient
