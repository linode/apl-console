import { applyAclToUiSchema, getSpec, podSpecUiSchema, setSecretsEnum } from 'common/api-spec'
import { cloneDeep, get, unset } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { GetJobApiResponse, GetSecretsApiResponse, GetSessionApiResponse, GetSettingsApiResponse } from 'redux/otomiApi'
import Form from './rjsf/Form'

const getJobSchema = (settings: GetSettingsApiResponse, formData: any, secrets: Array<any>): any => {
  const schema = cloneDeep(getSpec().components.schemas.Job)
  const jobSpecPath = 'allOf[1].properties'
  const containerSpecPath = 'allOf[2].allOf[2].allOf[1].properties'
  const initcontainerSpecPath = 'allOf[1].properties.init.items.allOf[1].properties'
  unset(schema, `${containerSpecPath}.command`)
  unset(schema, `${containerSpecPath}.args`)
  unset(schema, `${initcontainerSpecPath}.command`)
  unset(schema, `${initcontainerSpecPath}.args`)
  if (formData?.type === 'Job') unset(schema, `${jobSpecPath}.schedule`)

  // set the Secrets enum with items to choose from
  setSecretsEnum(get(schema, initcontainerSpecPath), secrets)
  setSecretsEnum(get(schema, containerSpecPath), secrets)

  return schema
}

const jobSpecUiSchema = {
  ...podSpecUiSchema,
  script: { 'ui:widget': 'textarea' },
}

const getJobUiSchema = (user: GetSessionApiResponse['user'], teamId: string): any => {
  const uiSchema = {
    ...jobSpecUiSchema,
    id: { 'ui:widget': 'hidden' },
    name: { 'ui:autofocus': true },
    teamId: { 'ui:widget': 'hidden' },
    init: { 'ui:field': 'collapse', ...jobSpecUiSchema },
  }

  applyAclToUiSchema(uiSchema, user, teamId, 'Job')

  return uiSchema
}

interface Props extends CrudProps {
  job?: GetJobApiResponse
  secrets: GetSecretsApiResponse
  teamId: string
}

export default function ({ job, secrets, teamId, ...other }: Props): React.ReactElement {
  const { user, settings } = useSession()
  const [data, setData]: any = useState(job)
  useEffect(() => {
    setData(job)
  }, [job])
  // END HOOKS
  const formData = cloneDeep(data)
  const schema = getJobSchema(settings, data, secrets)
  const uiSchema = getJobUiSchema(user, teamId)
  return <Form schema={schema} uiSchema={uiSchema} onChange={setData} data={formData} resourceType='Job' {...other} />
}
