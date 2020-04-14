import axios from 'axios'
import OpenAPIClientAxios from 'openapi-client-axios'

// let baseUrl = 'http://127.0.0.1:8080/v1'
let baseUrl = '/api/v1'
let axiosConfigDefaults = {
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    'Auth-Group': undefined,
    'Auth-User': undefined,
  },
}
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.info('running in development mode')
  axiosConfigDefaults = {
    withCredentials: false,
    headers: {
      'Cache-Control': 'no-cache',
      'Auth-Group': 'admin',
      'Auth-User': 'bob.admin@otomi.cloud',
    },
  }
  baseUrl = 'http://127.0.0.1:8080/v1'
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
