import { omit } from 'lodash'
import React, { useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Service from '../components/Service'
import { useApi, useAuthz } from '../hooks/api'
import PaperLayout from '../layouts/Paper'

interface Params {
  teamId?: string
  serviceId?: string
}

// function convertDataFromServer(input) {
//   const data = cloneDeep(input)
//   if (data && data.ksvc.serviceType === 'ksvc') {
//     const secrets = {}
//     const serverSecrets = data.ksvc.secrets || []
//     serverSecrets.forEach((secret) => {
//       secrets[secret.name] = secret.entries
//     })
//     data.ksvc.secrets = secrets
//   }
//   return data
// }

// function convertDataFromClient(formData) {
//   if (!formData) return formData
//   const secrets = []
//   const data = cloneDeep(formData)
//   if (formData.ksvc.serviceType === 'ksvc') {
//     Object.keys(data.ksvc.secrets).forEach((key) => {
//       secrets.push({
//         name: key,
//         entries: data.ksvc.secrets[key],
//       })
//     })
//   }
//   data.ksvc.secrets = secrets
//   return omit(data, ['id', 'teamId'])
// }

export default ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement => {
  const { tid } = useAuthz(teamId)
  const [formdata, setFormdata] = useState()
  const [deleteId, setDeleteId]: any = useState()
  const [service, serviceLoading, serviceError]: any = useApi('getService', !!serviceId, [tid, serviceId])
  const [secrets, secretsLoading, secretsError]: any = useApi('getSecrets', true, [tid])
  const [createRes, createLoading, createError] = useApi(
    serviceId ? 'editService' : 'createService',
    !!formdata,
    // serviceId ? [tid, serviceId, convertDataFromClient(formdata)] : [tid, convertDataFromClient(formdata)],
    serviceId ? [tid, serviceId, omit(formdata, ['id', 'teamId'])] : [tid, formdata],
  )
  const [deleteRes, deleteLoading, deleteError] = useApi('deleteService', !!deleteId, [tid, serviceId])
  if ((deleteRes && !(deleteLoading || deleteError)) || (createRes && !(createLoading || createError))) {
    return <Redirect to={`/teams/${tid}/services`} />
  }
  const loading = serviceLoading || secretsLoading || createLoading || deleteLoading
  const err = serviceError || secretsError || createError || deleteError
  const comp = !loading && (!err || formdata || service) && (
    <Service
      teamId={tid}
      // service={formdata || convertDataFromServer(service)}
      service={formdata || service}
      secrets={secrets}
      onSubmit={setFormdata}
      onDelete={setDeleteId}
    />
  )
  return <PaperLayout loading={loading} comp={comp} />
}
