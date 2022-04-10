import { applyAclToUiSchema, getIngressSchemaPath, getSpec, podSpecUiSchema, setSecretsEnum } from 'common/api-spec'
import { JSONSchema7Definition } from 'json-schema'
import { cloneDeep, get, isEmpty, set, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import {
  GetSecretsApiResponse,
  GetServiceApiResponse,
  GetSessionApiResponse,
  GetSettingsApiResponse,
} from 'redux/otomiApi'
import { getStrict } from 'utils/schema'
import Form from './rjsf/Form'

const idxMap = {
  private: 1,
  public: 2,
  tlsPass: 3,
}

export const addDomainEnumField = (schema: JSONSchema7Definition, settings, formData): void => {
  const { cluster, dns } = settings
  if (['cluster', 'tlsPass'].includes(formData?.ingress?.type)) return
  const ing = formData?.ingress
  const idx = idxMap[formData?.ingress?.type]
  if (!formData || isEmpty(ing)) return
  const ingressSchemaPath = getIngressSchemaPath(idx)
  const ingressSchema = getStrict(schema, ingressSchemaPath)
  const zones = [cluster.domainSuffix, ...(dns?.zones || [])]
  if (!ingressSchema) return
  if (formData.ingress.domain) {
    const { length } = formData.ingress.domain
    ingressSchema.subdomain.maxLength = 64 - length
  }
  // we only need to create an enum if we have more than one option
  if (ing.useDefaultSubdomain && !ing.domain) ing.domain = zones[0]
  if (zones.length > 1) ingressSchema.domain.enum = zones
  else if (!ing.domain) ing.domain = zones[0]
  ingressSchema.domain.readOnly = true
}

export const getServiceSchema = (
  appsEnabled: Record<string, any>,
  settings: GetSettingsApiResponse,
  formData,
  user,
  secrets: Array<any>,
): any => {
  const { cluster, otomi } = settings
  const schema = cloneDeep(getSpec().components.schemas.Service) as any
  const ksvcSchemaPath = 'properties.ksvc.oneOf[2].allOf[2].properties'
  addDomainEnumField(schema, settings, formData)
  const ing = formData?.ingress
  const idx = idxMap[formData?.ingress?.type]
  if (idx) {
    const ingressSchemaPath = getIngressSchemaPath(idx)
    const ingressSchema = getStrict(schema, ingressSchemaPath)

    if (ing?.tlsPass) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'hasCert')
      unset(ingressSchema, 'path')
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    }
    if (cluster.provider !== 'aws') unset(ingressSchema, `certArn`)

    if (!ing?.hasCert) {
      unset(ingressSchema, `certArn`)
      unset(ingressSchema, `certName`)
      unset(ingressSchema, `certSelect`)
    } else if (ing) {
      // Give the certName an enum selector with names of existing tls secrets
      if (ing.certSelect) {
        const tlsSecretNames = secrets.filter((s) => s.secret.type === 'tls').map((s) => s.name)
        set(ingressSchema, `certName.enum`, tlsSecretNames)
        if (secrets.length === 1) ing.certName = tlsSecretNames[0]
      }
    }
    if (['cluster', 'tlsPass'].includes(ing?.type)) {
      unset(ingressSchema, 'auth')
      unset(ingressSchema, 'forwardPath')
      unset(ingressSchema, 'path')
      unset(ingressSchema, 'hasCert')
    }
  }
  if (!user.isAdmin) delete schema.properties.namespace
  if (!appsEnabled.knative) schema.properties.ksvc.oneOf.splice(1, 2)
  // if (!appsEnabled.knative) {
  //   schema.properties.ksvc.oneOf[1].disabled = true
  //   schema.properties.ksvc.oneOf[2].disabled = true
  // }
  // set the Secrets enum with items to choose from
  else setSecretsEnum(get(schema, ksvcSchemaPath), secrets)

  return schema
}

export const getServiceUiSchema = (
  appsEnabled: Record<string, any>,
  { otomi }: GetSettingsApiResponse,
  formData: GetServiceApiResponse,
  user: GetSessionApiResponse['user'],
  teamId: string,
): any => {
  const ing = formData?.ingress as any
  const uiSchema: any = {
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    ingress: {
      domain: { 'ui:readonly': ing?.useDefaultSubdomain },
      subdomain: { 'ui:readonly': ing?.useDefaultSubdomain },
      // @ts-ignore
      certArn: { 'ui:readonly': formData?.ingress?.certSelect },
      tlsPass: { 'ui:readonly': formData?.ksvc?.serviceType !== 'svcPredeployed' },
    },
    ksvc: {
      ...podSpecUiSchema,
    },
  }
  // TODO: Not working yet, see bug: https://github.com/rjsf-team/react-jsonschema-form/issues/2776
  // So we remove the item from the schema instead (see getServiceSchema above)
  // if (!appsEnabled.alertmanager || !otomi.isMultitenant) uiSchema.ksvc = { 'ui:enumDisabled': [1, 2] }

  applyAclToUiSchema(uiSchema, user, teamId, 'Service')

  return uiSchema
}

interface Props extends CrudProps {
  service?: GetServiceApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

export default function ({ service, secrets, teamId, ...other }: Props): React.ReactElement {
  const { appsEnabled, settings, user } = useSession()
  const [data, setData]: any = useState(service)
  useEffect(() => {
    setData(service)
  }, [service])
  // END HOOKS
  // manipulate form data and set derived stuff:
  const formData = cloneDeep(data)
  const teamSubdomain = formData?.name ? `${formData.name}.${user.isAdmin ? '' : `team-${teamId}`}` : ''
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
  // pass to the schema getters that manipulate the schemas based on form data
  const schema = getServiceSchema(appsEnabled, settings, formData, user, secrets)
  const uiSchema = getServiceUiSchema(appsEnabled, settings, formData, user, teamId)
  return (
    <Form schema={schema} uiSchema={uiSchema} data={formData} onChange={setData} resourceType='Service' {...other} />
  )
}
