/* eslint-disable react/button-has-type */
import { Box, Button, ButtonGroup, Typography } from '@mui/material'
import YAML from 'yaml'
import { cloneDeep, omit } from 'lodash'
import { CrudProps } from 'pages/types'
import React, { useEffect, useMemo, useState } from 'react'
import { GetSessionApiResponse } from 'redux/otomiApi'
import { useHistory } from 'react-router-dom'
import { useSession } from 'providers/Session'
import { applyAclToUiSchema, getSpec } from 'common/api-spec'
import { useAppDispatch } from 'redux/hooks'
import { setError } from 'redux/reducers'
import { makeStyles } from 'tss-react/mui'
import CodeEditor from '../pages/workloads/create-edit/WorkloadsCodeEditor'
import Form from './rjsf/Form'
import DeleteButton from './DeleteButton'
import { DocsLink } from './DocsLink'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    paddingTop: theme.spacing(3),
    width: '100%',
    left: 0,
    backgroundColor: theme.palette.background.default,
  },
  imgHolder: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
    display: 'inline-flex',
  },
  img: {
    height: theme.spacing(6),
  },
}))

const checkImageFields = (data: any) => {
  if (data?.repository && data?.tag) return ''
  if (data?.repository) return "The 'tag' field for the image should be filled in!"
  if (data?.tag) return "The 'repository' field for the image should be filled in!"
  return "The 'repository' and 'tag' fields for the image should be filled in!"
}

export const getDocsLink = (url: string, path: string): string => {
  if (process.env.NODE_ENV === 'development') return `${url.replace('.git', '')}/blob/main/${path}/README.md`
  return `${url.replace('.git', '')}/src/branch/main/${path}/README.md`
}

export const getWorkloadSchema = (): any => {
  return cloneDeep(getSpec().components.schemas.Workload)
}

export const getWorkloadUiSchema = (user: GetSessionApiResponse['user'], teamId: string, isNameEditable): any => {
  const uiSchema = {
    'ui:description': ' ',
    id: { 'ui:widget': 'hidden' },
    teamId: { 'ui:widget': 'hidden' },
    icon: { 'ui:widget': 'hidden' },
    url: { 'ui:widget': 'hidden' },
    chartProvider: { 'ui:widget': 'hidden' },
    chartMetadata: { 'ui:widget': 'hidden' },
    path: { 'ui:widget': 'hidden' },
    chart: { 'ui:widget': 'hidden' },
    revision: { 'ui:widget': 'hidden' },
    namespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    createNamespace: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    sidecarInject: teamId !== 'admin' && { 'ui:widget': 'hidden' },
    name: { 'ui:readonly': !isNameEditable },
  }
  applyAclToUiSchema(uiSchema, user, teamId, 'workload')
  return uiSchema
}

interface Props extends CrudProps {
  teamId: string
  workload?: any
  workloadName?: string
  values?: any
  valuesSchema?: any
  createWorkload: any
  updateWorkload: any
  deleteWorkload: any
}

export default function ({
  teamId,
  workload,
  workloadName,
  values,
  valuesSchema,
  createWorkload,
  updateWorkload,
  deleteWorkload,
  ...other
}: Props): React.ReactElement {
  const history = useHistory()
  const { classes } = useStyles()
  const dispatch = useAppDispatch()
  const { user } = useSession()

  const [data, setData] = useState<any>(workload)
  const [workloadValuesYaml, setWorkloadValuesYaml] = useState(
    typeof values === 'string' ? values : YAML.stringify(values ?? {}),
  )

  const workloadValuesJson = useMemo(() => {
    try {
      return YAML.parse(workloadValuesYaml)
    } catch {
      return {}
    }
  }, [workloadValuesYaml])

  const icon = data?.icon || '/logos/akamai_logo.svg'

  useEffect(() => {
    if (!workload) return
    setData(workload)
    setWorkloadValuesYaml(typeof values === 'string' ? values : YAML.stringify(values ?? {}))
  }, [workload, values])

  const handleCreateUpdateWorkload = async () => {
    /** this is very temporary solution to add max character limit to workloads
     *
     *  REMOVE THIS WHEN MIGRATING TO THE NEW UI
     */
    const input = document.getElementById('root_name')?.parentElement as HTMLInputElement | null
    if (input) {
      input.style.border = ''
      const oldErr = document.getElementById('root-name-error')
      if (oldErr) oldErr.remove()
    }

    if ((data.name || '').length > 16) {
      if (input) {
        input.style.border = '1px solid red'
        const err = document.createElement('p')
        err.id = 'root-name-error'
        err.textContent = `Workload name cannot be longer than 16 characters`
        err.style.color = 'red'
        err.style.fontSize = '12px'
        input.parentNode.insertBefore(err, input.nextSibling)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const workloadBody = omit(data, ['chartProvider', 'chart', 'revision'])
    const chartMetadata = omit(data?.chartMetadata, ['helmChartCatalog', 'helmChart'])
    const path = workload?.path

    const body = {
      kind: 'AplTeamWorkload',
      metadata: {
        name: workloadName ?? data?.name,
        labels: { 'apl.io/teamId': teamId },
      },
      spec: {
        ...workloadBody,
        chartMetadata,
        url: workload?.url,
        path,
        values: workloadValuesYaml,
      },
    }

    let res
    if (workloadName) {
      dispatch(setError(undefined))
      res = await updateWorkload({ teamId, workloadName, body })
    } else res = await createWorkload({ teamId, body })

    if (!res.error) history.push(`/teams/${teamId}/workloads`)
  }

  const schema = getWorkloadSchema()
  const uiSchema = getWorkloadUiSchema(user, teamId, !workload?.name)

  return (
    <Box sx={{ width: '100%' }}>
      <Box className={classes.header}>
        <Box className={classes.imgHolder}>
          <img
            className={classes.img}
            src={icon}
            onError={({ currentTarget }) => {
              // might need another fix
              // eslint-disable-next-line no-param-reassign
              currentTarget.onerror = null // prevents looping
              // eslint-disable-next-line no-param-reassign
              currentTarget.src = `${icon}`
            }}
            alt={`Logo for ${icon}`}
          />
        </Box>
        <Box>
          <Typography variant='h6'>
            {workload?.name ? `${workload.name} (${workload.path})` : workload?.path}
          </Typography>
        </Box>
        {workload.url && workload.path && (
          <Box sx={{ ml: 'auto' }}>
            <DocsLink href={getDocsLink(workload.url as string, workload.path as string)} />
          </Box>
        )}
      </Box>

      <Form
        schema={schema}
        uiSchema={uiSchema}
        data={data}
        onChange={setData}
        resourceType='Workload'
        children
        hideHelp
        liveValidate={data?.name || data?.namespace}
        {...other}
      />

      <CodeEditor code={workloadValuesYaml} onChange={setWorkloadValuesYaml} validationSchema={valuesSchema} />

      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', float: 'right', mt: 2 }}>
        <ButtonGroup sx={{ gap: '10px' }}>
          <Button variant='contained' onClick={handleCreateUpdateWorkload}>
            Submit
          </Button>
          {workloadName && (
            <DeleteButton
              onDelete={() => deleteWorkload({ teamId, workloadName })}
              resourceName={workload?.name}
              resourceType='workload'
              data-cy='button-delete-workload'
            />
          )}
        </ButtonGroup>
      </Box>
    </Box>
  )
}
