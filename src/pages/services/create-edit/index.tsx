/* eslint-disable dot-notation */
import { Box, Divider, Grid } from '@mui/material'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useMemo, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateAplServiceApiResponse,
  useCreateAplServiceMutation,
  useDeleteAplServiceMutation,
  useEditAplServiceMutation,
  useGetAplServiceQuery,
  useGetSealedSecretsQuery,
  useGetSettingsInfoQuery,
  useGetTeamK8SServicesQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useSession } from 'providers/Session'
import DeleteButton from 'components/DeleteButton'
import FormRow from 'components/forms/FormRow'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import { MenuItem } from 'components/List'
import { Typography } from 'components/Typography'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { cloneDeep, isEmpty, isEqual } from 'lodash'
import LinkedNumberField from 'components/forms/LinkedNumberField'
import AdvancedSettings from 'components/AdvancedSettings'
import font from 'theme/font'
import { Autocomplete } from 'components/forms/Autocomplete'
import { LoadingButton } from '@mui/lab'
import { useStyles } from './create-edit.styles'
import { serviceApiResponseSchema } from './create-edit.validator'

interface Params {
  teamId: string
  serviceName?: string
}

interface K8Service {
  name: string
  ports?: number[]
  managedByKnative?: boolean
}

export default function ({
  match: {
    params: { teamId, serviceName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const { classes } = useStyles()
  const {
    settings: {
      cluster,
      otomi: { isPreInstalled },
    },
  } = useSession()
  const [service, setService] = useState<K8Service | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)
  const [hasSetActiveService, setHasSetActiveService] = useState(false)

  const getKeyValue = (activeService: K8Service) => {
    let compositeUrl = ''
    if (activeService !== undefined) {
      compositeUrl = activeService?.managedByKnative
        ? `${activeService.name}-team-${teamId}.${cluster.domainSuffix}`
        : `${activeService.name}-${teamId}.${cluster.domainSuffix}`
    } else compositeUrl = `*-${teamId}.${cluster.domainSuffix}`
    return compositeUrl
  }

  // api calls
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplServiceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplServiceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplServiceMutation()
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchService,
  } = useGetAplServiceQuery({ teamId, serviceName }, { skip: !serviceName })
  const {
    data: k8sServices,
    isLoading: isLoadingK8sServices,
    isFetching: isFetchingK8sServices,
    isError: isErrorK8sServices,
    refetch: refetchK8sServices,
  } = useGetTeamK8SServicesQuery({ teamId })

  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const {
    data: settingsInfo,
    isLoading: isLoadingSettingsInfo,
    isFetching: isFetchingSettingsInfo,
    isError: isErrorSettingsInfo,
    refetch: refetchSettingsInfo,
  } = useGetSettingsInfoQuery()

  const teamSecrets = teamSealedSecrets?.filter((secret) => secret.type === 'kubernetes.io/tls') || []
  const updatedIngressClassNames = [...(settingsInfo?.ingressClassNames ?? []), 'platform']
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetchService()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingK8sServices) refetchK8sServices()
    if (!isFetchingSettingsInfo) refetchSettingsInfo()
  }, [isDirty])

  // form state
  const methods = useForm<CreateAplServiceApiResponse>({
    resolver: yupResolver(serviceApiResponseSchema) as Resolver<CreateAplServiceApiResponse>,
    defaultValues: data,
    context: { domainSuffix: cluster.domainSuffix },
  })
  const {
    control,
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = methods

  useEffect(() => {
    if (data) reset(data)

    if (!isEmpty(data?.spec?.paths)) {
      data.spec?.paths.forEach((path, index) => {
        if (path.includes('/')) setValue(`spec.paths.${index}`, path.replace(/^\/+/, ''))
      })
    }

    if (teamId !== 'admin' && !serviceName) setValue('spec.namespace', `team-${teamId}`)
  }, [data, setValue])

  useEffect(() => {
    const serviceDomain = getKeyValue(service)
    setUrl(serviceDomain)
    setValue('spec.domain', serviceDomain)
  }, [service])
  const filteredK8Services = useMemo(() => {
    return (
      k8sServices?.filter(
        (service) =>
          !service.name.includes('grafana') &&
          !service.name.includes('prometheus') &&
          !service.name.includes('alertmanager') &&
          !service.name.includes('tekton-dashboard'),
      ) || []
    )
  }, [k8sServices])

  useEffect(() => {
    if (!hasSetActiveService && data?.metadata.name) {
      setActiveService(data?.metadata.name)
      setHasSetActiveService(true)
    }
  }, [hasSetActiveService, data?.metadata.name])

  const TrafficControlEnabled = watch('spec.trafficControl.enabled')
  function setActiveService(name: string) {
    if (teamId === 'admin') setService({ name, ports: [] })
    else {
      const activeService = filteredK8Services?.find((service) => service.name === name) as unknown as K8Service
      setService(activeService)
      setValue('spec.port', data?.spec?.port || activeService?.ports[0])
      if (activeService?.managedByKnative) setValue('spec.ksvc.predeployed', true)
      else setValue('spec.ksvc.predeployed', false)
    }
  }
  const onSubmit = (submitData: CreateAplServiceApiResponse) => {
    const body = cloneDeep(submitData)
    if (!isEmpty(body.spec?.paths)) {
      body.spec?.paths.forEach((path, index) => {
        body.spec.paths[index] = `/${path}`
      })
    }
    if (body.spec?.cname?.tlsSecretName === '') {
      body.spec.cname.tlsSecretName = undefined
      body.spec.useCname = false
    } else if (body.spec?.cname?.tlsSecretName) body.spec.useCname = true

    if (body.spec?.ingressClassName === '') body.spec.ingressClassName = undefined
    if (isPreInstalled) body.spec.ingressClassName = 'platform'
    if (serviceName) update({ teamId, serviceName, body })
    else create({ teamId, body })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/services`} />

  const loading = isLoading || isLoadingK8sServices || isLoadingTeamSecrets || isLoadingSettingsInfo
  const fetching = isFetching || isFetchingK8sServices || isFetchingTeamSecrets || isFetchingSettingsInfo
  const error = isError || isErrorK8sServices || isErrorTeamSecrets || isErrorSettingsInfo

  if (loading || fetching) return <PaperLayout loading title={t('TITLE_SERVICE')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SERVICE')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/team-services'
          title={serviceName ? data.metadata.name : 'Create'}
          // hides the first two crumbs (e.g. /teams/teamName)
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General'>
              <FormRow spacing={10}>
                {teamId === 'admin' && (
                  <TextField
                    label='Namespace'
                    width='large'
                    {...register('spec.namespace')}
                    error={!!errors.spec?.namespace}
                    helperText={errors.spec?.namespace?.message?.toString()}
                  />
                )}
              </FormRow>
              <FormRow key={1} spacing={10}>
                {teamId === 'admin' ? (
                  <TextField
                    label='Service Name'
                    width='large'
                    {...register('metadata.name')}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('metadata.name', value)
                      setValue('metadata.labels', { 'apl.io/teamId': teamId })
                      setValue('spec.domain', value)
                      setActiveService(value)
                    }}
                    value={watch('metadata.name', data?.metadata.name)}
                  />
                ) : (
                  <TextField
                    label='Service Name'
                    width='large'
                    {...register('metadata.name')}
                    select
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('metadata.name', value)
                      setValue('metadata.labels', { 'apl.io/teamId': teamId })
                      setValue('spec.domain', value)
                      setActiveService(value)
                    }}
                    value={watch('metadata.name', data?.metadata.name)}
                  >
                    <MenuItem key='select-a-service' value='' disabled classes={undefined}>
                      Select a service
                    </MenuItem>
                    {filteredK8Services?.map((service) => (
                      <MenuItem key={service.name} value={service.name} classes={undefined}>
                        {service.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {service?.ports.length === 1 || teamId === 'admin' ? (
                  <TextField
                    label='Port'
                    width='small'
                    {...register('spec.port')}
                    disabled={service?.ports.length > 1}
                    value={watch('spec.port') || data?.spec?.port[0]}
                    error={!!errors.spec?.port}
                    helperText={errors.spec?.port?.message?.toString()}
                  />
                ) : (
                  <TextField
                    label='Port'
                    width='small'
                    {...register('spec.port')}
                    select
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      setValue('spec.port', value)
                    }}
                    placeholder='Select a port'
                    value={watch('spec.port') || data?.spec?.port}
                    error={!!errors.spec?.port}
                    helperText={errors.spec?.port?.message?.toString()}
                  >
                    {service?.ports.map((port) => (
                      <MenuItem key={`service-${port}`} value={port} classes={undefined}>
                        {port}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </FormRow>
              <FormRow spacing={10}>
                <TextField label='URL' width='large' disabled value={url} />
              </FormRow>
              {!isPreInstalled && (
                <FormRow spacing={10}>
                  <Autocomplete
                    label='Ingress Class Name'
                    loading={isLoadingSettingsInfo}
                    options={(updatedIngressClassNames || []).map((ingressClassName) => {
                      return {
                        label: ingressClassName,
                        value: ingressClassName,
                      }
                    })}
                    width='large'
                    placeholder='Select a Ingress Class Name'
                    {...register('spec.ingressClassName')}
                    value={watch('spec.ingressClassName') || 'platform'}
                    onChange={(e, value: { label: string }) => {
                      const label: string = value?.label || ''
                      setValue('spec.ingressClassName', label)
                    }}
                  />
                </FormRow>
              )}
            </Section>
            <AdvancedSettings title='Advanced Settings' closed>
              <Section>
                <KeyValue
                  title='URL paths'
                  subTitle='By default all paths are allowed. If filled in, URL paths that are not explicitly added here will result in a page not found error.'
                  keyDisabled
                  keyValue={url}
                  keyLabel='Domain'
                  valueLabel='Path'
                  showLabel={false}
                  compressed
                  addLabel='Add URL path'
                  onlyValue
                  keySize='large'
                  valueSize='medium'
                  name='ingress.paths'
                  error={!!errors.spec?.paths}
                  helperText={errors.spec?.paths?.root?.message?.toString()}
                  {...register('spec.paths')}
                />

                <Divider sx={{ mt: 4, mb: 2 }} />
                <Typography
                  sx={{
                    color: 'text.primary',
                    fontSize: '1rem',
                    lineHeight: '1.5rem',
                    fontWeight: 700,
                    fontFamily: font.bold,
                  }}
                >
                  Canonical Name (CNAME)
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#ABABAB', lineHeight: '1.25rem' }}>
                  Use a Canonical Name (CNAME) that points to the Service domain name.
                </Typography>
                <FormRow key={1} spacing={10}>
                  <TextField
                    label='Domain'
                    error={!!errors.spec?.cname}
                    helperText={errors.spec?.cname?.root?.message?.toString()}
                    width='large'
                    type='text'
                    {...register('spec.cname.domain')}
                  />
                  <Autocomplete
                    label='TLS Secret'
                    loading={isLoadingTeamSecrets}
                    options={(teamSecrets || []).map((secret) => {
                      return {
                        label: secret.name,
                        value: secret.name,
                      }
                    })}
                    placeholder='Select a TLS Secret'
                    {...register('spec.cname.tlsSecretName')}
                    value={watch('spec.cname.tlsSecretName') || ''}
                    onChange={(e, value: { label: string }) => {
                      const label: string = value?.label || ''
                      setValue('spec.cname.tlsSecretName', label)
                    }}
                  />
                </FormRow>

                <Divider sx={{ mt: 4, mb: 2 }} />

                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.tlsPass'
                  control={control}
                  label='TLS Passthrough'
                  explainertext='Requests will be forwarded to the backend service without being decrypted'
                />

                <Divider sx={{ mt: 4, mb: 2 }} />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.trafficControl.enabled'
                  control={control}
                  label='Enable Traffic Management'
                  explainertext='Split traffic between two versions (A/B testing, canary). (Enable this feature only if you have two
                    deployments behind that service)'
                />
                <LinkedNumberField
                  registers={{
                    registerA: { ...register('spec.trafficControl.weightV1') },
                    registerB: { ...register('spec.trafficControl.weightV2') },
                    setValue,
                    watch,
                  }}
                  labelA='Version A'
                  labelB='Version B'
                  valueMax={100}
                  disabled={!TrafficControlEnabled}
                  error={!!errors.spec?.trafficControl?.weightV1 || !!errors.spec?.trafficControl?.weightV2}
                  helperText={
                    errors.spec?.trafficControl?.weightV1 || errors.spec?.trafficControl?.weightV2
                      ? 'The values must be in a range of "0" and "100"'
                      : undefined
                  }
                />

                <Divider sx={{ mt: 4, mb: 2 }} />

                <KeyValue
                  title='HTTP Response Headers'
                  keyLabel='Name'
                  valueLabel='Value'
                  addLabel='Add response header'
                  name='ingress.headers.response.set'
                  error={!!errors.spec?.headers}
                  helperText={errors.spec?.headers ? '"Name" and "Value" must both be filled in' : undefined}
                  {...register('spec.headers.response.set')}
                />
              </Section>
            </AdvancedSettings>
            <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '12px', marginRight: '10px' }}>
                The service will be exposed as: {url}
              </Typography>
              {serviceName && (
                <DeleteButton
                  onDelete={() => del({ teamId, serviceName })}
                  resourceName={watch('metadata.name')}
                  resourceType='service'
                  data-cy='button-delete-service'
                  sx={{ marginRight: '10px', textTransform: 'capitalize', ml: 2 }}
                  loading={isLoadingDelete}
                  disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
                />
              )}
              <LoadingButton
                type='submit'
                variant='contained'
                color='primary'
                sx={{ textTransform: 'none' }}
                loading={isLoadingCreate || isLoadingUpdate}
                disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || isEqual(watch(), data)}
              >
                {serviceName ? 'Save Changes' : 'Create Service'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
