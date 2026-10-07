/* eslint-disable dot-notation */
import { Box, Grid } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { yupResolver } from '@hookform/resolvers/yup'
import { cloneDeep, isEmpty, isEqual } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FieldPath, FormProvider, Resolver, useController, useForm } from 'react-hook-form'

import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import DeleteButton from 'components/DeleteButton'
import FormRow from 'components/forms/FormRow'
import Section from 'components/Section'
import { TextField } from 'components/forms/TextField'
import { MenuItem } from 'components/List'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import LinkedNumberField from 'components/forms/LinkedNumberField'
import AdvancedSettings from 'components/AdvancedSettings'
import { Autocomplete } from 'components/forms/Autocomplete'
import { useSession } from 'providers/Session'
import { useAppSelector } from 'redux/hooks'

import {
  CreateAplServiceApiResponse,
  useCreateAplServiceMutation,
  useDeleteAplServiceMutation,
  useEditAplServiceMutation,
  useGetAplSealedSecretsQuery,
  useGetAplServiceQuery,
  useGetK8SServicesQuery,
  useGetSettingsInfoQuery,
  useGetTeamAplServicesQuery,
} from 'redux/otomiApi'

import { useStyles } from './create-edit-services.styles'
import { serviceApiResponseSchema } from './create-edit-services.validator'

interface Params {
  teamId: string
  serviceName?: string
}

interface K8Service {
  name: string
  ports?: number[]
  managedByKnative?: boolean
}

export default function ServicesCreateEditPage({
  match: {
    params: { teamId, serviceName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
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

  const getKeyValue = (activeService: K8Service) => {
    let compositeUrl = ''

    if (activeService !== undefined) {
      compositeUrl = activeService?.managedByKnative
        ? `${activeService.name}-team-${teamId}.${cluster.domainSuffix}`
        : `${activeService.name}-${teamId}.${cluster.domainSuffix}`
    } else compositeUrl = `*-${teamId}.${cluster.domainSuffix}`

    return compositeUrl
  }

  // API calls
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
  } = useGetK8SServicesQuery({ teamId })

  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetAplSealedSecretsQuery({ teamId }, { skip: !teamId })

  const {
    data: settingsInfo,
    isLoading: isLoadingSettingsInfo,
    isFetching: isFetchingSettingsInfo,
    isError: isErrorSettingsInfo,
    refetch: refetchSettingsInfo,
  } = useGetSettingsInfoQuery()

  const { data: teamServices } = useGetTeamAplServicesQuery({ teamId }, { skip: !teamId })

  const teamSecrets = teamSealedSecrets?.filter((secret) => secret?.spec?.template?.type === 'kubernetes.io/tls') || []

  const updatedIngressClassNames = [...(settingsInfo?.ingressClassNames ?? []), 'platform']

  const existingNames = (teamServices ?? [])
    .map((item) => item?.metadata?.name)
    .filter((name): name is string => Boolean(name))

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return

    if (!isFetching) refetchService()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingK8sServices) refetchK8sServices()
    if (!isFetchingSettingsInfo) refetchSettingsInfo()
  }, [isDirty])

  // Form state
  const methods = useForm<CreateAplServiceApiResponse>({
    resolver: yupResolver(serviceApiResponseSchema) as Resolver<CreateAplServiceApiResponse>,
    defaultValues: data,
    context: {
      domainSuffix: cluster.domainSuffix,
      existingNames,
      currentName: data?.metadata?.name,
      validateOnSubmit: !serviceName,
    },
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

  const { field: ingressClassField } = useController<CreateAplServiceApiResponse>({
    control,
    name: 'spec.ingressClassName' as FieldPath<CreateAplServiceApiResponse>,
  })

  const { field: tlsSecretField } = useController<CreateAplServiceApiResponse>({
    control,
    name: 'spec.cname.tlsSecretName' as FieldPath<CreateAplServiceApiResponse>,
  })

  const { field: nameField } = useController<CreateAplServiceApiResponse>({
    control,
    name: 'metadata.name' as FieldPath<CreateAplServiceApiResponse>,
  })

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
  }, [service])

  const filteredK8Services = useMemo(() => {
    const existingNameSet = new Set(existingNames.map((name) => name.trim().toLowerCase()))

    return (
      k8sServices?.filter((service) => {
        const isSystemService =
          service.name.includes('grafana') ||
          service.name.includes('prometheus') ||
          service.name.includes('alertmanager') ||
          service.name.includes('tekton-dashboard')

        if (isSystemService) return false

        if (serviceName) return true

        return !existingNameSet.has(service.name.trim().toLowerCase())
      }) ?? []
    )
  }, [k8sServices, existingNames, serviceName])

  useEffect(() => {
    if (data?.metadata.name) setActiveService(data.metadata.name)
  }, [data?.metadata.name, filteredK8Services])

  const trafficControlEnabled = watch('spec.trafficControl.enabled')

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
          hideCrumbX={[0, 1]}
        />

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General' description='Configure the service, port and network exposure.'>
              <FormRow
                spacing={10}
                sx={{
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                {teamId === 'admin' && (
                  <TextField
                    label='Namespace'
                    width='large'
                    {...register('spec.namespace')}
                    error={!!errors.spec?.namespace}
                    helperText={errors.spec?.namespace?.message?.toString()}
                  />
                )}

                {teamId === 'admin' ? (
                  <TextField
                    label='Service Name'
                    width='large'
                    {...register('metadata.name')}
                    onChange={(e) => {
                      const value = e.target.value

                      setValue('metadata.name', value)
                      setValue('metadata.labels', {
                        'apl.io/teamId': teamId,
                      })

                      setActiveService(value)
                    }}
                    value={watch('metadata.name', data?.metadata.name)}
                  />
                ) : (
                  <Autocomplete<string, false, false, false>
                    label='Service Name'
                    width='large'
                    options={filteredK8Services.map((service) => service.name)}
                    getOptionLabel={(service) => service}
                    placeholder='Select a service'
                    value={typeof nameField.value === 'string' ? nameField.value : ''}
                    onChange={(_e, value) => {
                      nameField.onChange(value ?? '')

                      setValue('metadata.labels', {
                        'apl.io/teamId': teamId,
                      })

                      setActiveService(value ?? '')
                    }}
                    errorText={errors.metadata?.name?.message?.toString()}
                  />
                )}

                {teamId === 'admin' || !service?.ports?.length || service.ports.length === 1 ? (
                  <TextField
                    label='Port'
                    width='small'
                    {...register('spec.port')}
                    disabled={teamId !== 'admin' && (!!serviceName || service?.ports?.length === 1)}
                    value={watch('spec.port') ?? data?.spec?.port?.[0] ?? ''}
                    error={!!errors.spec?.port}
                    helperText={errors.spec?.port?.message?.toString()}
                  />
                ) : (
                  <TextField
                    label='Port'
                    width='small'
                    {...register('spec.port')}
                    select
                    disabled={teamId !== 'admin' && !!serviceName}
                    onChange={(e) => {
                      setValue('spec.port', Number(e.target.value))
                    }}
                    placeholder='Select a port'
                    value={watch('spec.port') ?? data?.spec?.port ?? ''}
                    error={!!errors.spec?.port}
                    helperText={errors.spec?.port?.message?.toString()}
                  >
                    {service.ports.map((port) => (
                      <MenuItem key={`service-${port}`} value={port} classes={undefined}>
                        {port}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </FormRow>

              <FormRow
                spacing={10}
                sx={{
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <TextField label='URL' width='large' disabled value={url} />

                {!isPreInstalled && (
                  <Autocomplete<string, false, false, false>
                    label='Ingress Class Name'
                    width='large'
                    loading={isLoadingSettingsInfo}
                    options={updatedIngressClassNames}
                    placeholder='Select an Ingress Class Name'
                    value={typeof ingressClassField.value === 'string' ? ingressClassField.value : ''}
                    onChange={(_e, value) => ingressClassField.onChange(value ?? '')}
                  />
                )}
              </FormRow>
            </Section>

            <AdvancedSettings title='Advanced Settings' closed>
              <Section
                title='URL Paths'
                description='By default all paths are allowed. Add paths to restrict the service to specific URLs.'
              >
                <KeyValue
                  keyDisabled
                  keyValue={url}
                  keyLabel='Domain'
                  valueLabel='Path'
                  showLabel={false}
                  compressed
                  noMarginTop
                  addLabel='Add URL path'
                  onlyValue
                  keySize='large'
                  valueSize='medium'
                  name='ingress.paths'
                  error={!!errors.spec?.paths}
                  helperText={errors.spec?.paths?.root?.message?.toString()}
                  {...register('spec.paths')}
                />
              </Section>

              <Section
                title='Canonical Name (CNAME)'
                description='Use a Canonical Name (CNAME) that points to the Service domain name.'
              >
                <FormRow
                  spacing={10}
                  sx={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <TextField
                    label='Domain'
                    error={!!errors.spec?.cname}
                    helperText={errors.spec?.cname?.root?.message?.toString()}
                    width='large'
                    type='text'
                    {...register('spec.cname.domain')}
                  />

                  <Autocomplete<string, false, false, false>
                    label='TLS Secret'
                    loading={isLoadingTeamSecrets}
                    width='large'
                    options={teamSecrets.map((secret) => secret.metadata.name)}
                    placeholder='Select a TLS Secret'
                    value={typeof tlsSecretField.value === 'string' ? tlsSecretField.value : ''}
                    onChange={(_e, value) => tlsSecretField.onChange(value ?? '')}
                  />
                </FormRow>
              </Section>

              <Section
                title='Traffic Management'
                description='Split traffic between two service versions for canary releases or A/B testing.'
              >
                <ControlledCheckbox
                  name='spec.trafficControl.enabled'
                  control={control}
                  label='Enable Traffic Management'
                  explainertext='Enable this feature only when two deployments are available behind the service.'
                />

                <LinkedNumberField
                  registers={{
                    registerA: {
                      ...register('spec.trafficControl.weightV1'),
                    },
                    registerB: {
                      ...register('spec.trafficControl.weightV2'),
                    },
                    setValue,
                    watch,
                  }}
                  labelA='Version A'
                  labelB='Version B'
                  valueMax={100}
                  disabled={!trafficControlEnabled}
                  error={!!errors.spec?.trafficControl?.weightV1 || !!errors.spec?.trafficControl?.weightV2}
                  helperText={
                    errors.spec?.trafficControl?.weightV1 || errors.spec?.trafficControl?.weightV2
                      ? 'The values must be in a range of "0" and "100"'
                      : undefined
                  }
                />
              </Section>

              <Section
                title='HTTP Response Headers'
                description='Add or override HTTP response headers returned by the service.'
              >
                <KeyValue
                  keyLabel='Name'
                  valueLabel='Value'
                  addLabel='Add response header'
                  noMarginTop
                  name='ingress.headers.response.set'
                  keySize='large'
                  valueSize='large'
                  error={!!errors.spec?.headers}
                  helperText={errors.spec?.headers ? '"Name" and "Value" must both be filled in' : undefined}
                  {...register('spec.headers.response.set')}
                />
              </Section>
            </AdvancedSettings>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              {serviceName && (
                <DeleteButton
                  onDelete={() => del({ teamId, serviceName })}
                  resourceName={watch('metadata.name')}
                  resourceType='service'
                  data-cy='button-delete-service'
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
