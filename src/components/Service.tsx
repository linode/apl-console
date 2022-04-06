import { getServiceSchema, getServiceUiSchema } from 'common/api-spec'
import { cloneDeep, unset } from 'lodash'
import { useSession } from 'providers/Session'
import React, { useState } from 'react'
import { GetSecretsApiResponse, GetServiceApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

interface Props {
  onSubmit: CallableFunction
  onDelete?: CallableFunction
  service?: GetServiceApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

export default function ({ onSubmit, onDelete, service, secrets, teamId }: Props): React.ReactElement {
  const { appsEnabled, oboTeamId, settings, user } = useSession()
  const [data, setData]: any = useState(service)
  // END HOOKS
  const formData = cloneDeep(data)
  const teamSubdomain = formData?.name ? `${formData.name}.team-${teamId}` : ''
  const defaultSubdomain = teamSubdomain
  if (formData?.ingress) {
    let ing = formData.ingress
    if (!['cluster'].includes(ing.type) && (!data.ingress?.domain || ing.useDefaultSubdomain)) {
      // Set default domain and subdomain if ingress type not is 'cluster'
      ing = { ...ing }
      ing.subdomain = defaultSubdomain
      formData.ingress = ing
    }
    if (ing?.type === 'tlsPass') {
      // we don't expect some props when choosing tlsPass
      ing = { ...ing }
      unset(ing, 'hasCert')
      unset(ing, 'certArn')
      unset(ing, 'certName')
      unset(ing, 'forwardPath')
      formData.ingress = ing
    } else if (ing?.type === 'cluster') {
      // cluster has an empty ingress
      formData.ingress = { type: 'cluster' }
    }
  }
  const schema = getServiceSchema(appsEnabled, settings, formData, secrets)
  const uiSchema = getServiceUiSchema(appsEnabled, settings, formData, user, oboTeamId)
  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={onSubmit}
      onDelete={onDelete}
      data={formData}
      onChange={setData}
      resourceName={service?.name}
      resourceType='Service'
    />
  )
}
