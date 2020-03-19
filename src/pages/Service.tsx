import React from 'react'
import Loader from '../components/Loader'
import Service from '../components/Services/Service'
import { useApi } from '../hooks/api'
import MainLayout from '../layouts/main'
import { useSession } from '../session-context'
import { useSnackbar } from '../utils'

const useSubmit = ({ data }): any => {
  const { enqueueSnackbar } = useSnackbar()
  const method = data.serviceId ? 'createService' : 'editService'
  const [result] = useApi(method, data)
  if (result) {
    enqueueSnackbar(`Service ${data.serviceId ? 'updated' : 'created'}`)
  }
}

const EditService = ({ serviceName, clusters }): any => {
  const [service, serviceLoading, serviceError]: [any, boolean, Error] = useApi('getService', serviceName)

  if (serviceLoading) {
    return <Loader />
  }
  if (serviceError) {
    return null
  }
  return <Service service={service} clusters={clusters} onSubmit={useSubmit} />
}

export default ({
  match: {
    params: { serviceName },
  },
}): any => {
  const { team } = useSession()
  return (
    <MainLayout>
      {serviceName && <EditService serviceName={serviceName} clusters={team.clusters} />}
      {!serviceName && <Service onSubmit={useSubmit} clusters={team.clusters} />}
    </MainLayout>
  )
}
