import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Divider, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateServiceApiResponse,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSealedSecretsQuery,
  useGetServiceQuery,
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
import { KeyboardArrowRight } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { isEmpty } from 'lodash'
import LinkedNumberField from 'components/forms/LinkedNumberField'
import { useStyles } from './create-edit.styles'
import { serviceApiResponseSchema } from './create-edit.validator'

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent', // Remove background color
  boxShadow: 'none !important', // Remove shadow
  margin: '0px !important', // No top margin
  '&:before': {
    display: 'none', // Remove the default border above the accordion
  },
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: 'transparent', // Remove background color
  boxShadow: 'none', // Remove shadow
  marginTop: '0px', // No top margin
  padding: 0,
  '&:before': {
    display: 'none', // Remove the default border above the accordion
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0', // Remove padding
  '.MuiAccordionSummary-content': {
    margin: '0', // Remove margin between text and icon
  },
  marginTop: '0px !important',
  display: 'inline-flex',
}))

interface Params {
  teamId: string
  serviceName?: string
}

interface K8Service {
  name: string
  ports: number[]
  managedByKnative: boolean
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
    settings: { cluster },
  } = useSession()
  const [service, setService] = useState<K8Service | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined)

  const getKeyValue = (activeService: K8Service) => {
    console.log('HERE')
    let compositeUrl = ''
    if (activeService !== undefined) {
      compositeUrl = activeService.managedByKnative
        ? `${activeService.name}-team-${teamId}.${cluster.domainSuffix}/`
        : `${activeService.name}-${teamId}.${cluster.domainSuffix}/`
    } else compositeUrl = `*-${teamId}.${cluster.domainSuffix}/`
    console.log('compositeUrl: ', compositeUrl)
    return compositeUrl
  }

  // api calls
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateServiceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditServiceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteServiceMutation()
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchService,
  } = useGetServiceQuery({ teamId, serviceName }, { skip: !serviceName })
  const {
    data: k8sServices,
    isLoading: isLoadingK8sServices,
    isFetching: isFetchingK8sServices,
    isError: isErrorK8sServices,
    refetch: refetchK8sServices,
  } = useGetTeamK8SServicesQuery({ teamId })

  const filteredK8Services = k8sServices?.filter(
    (service: K8Service) =>
      !service.name.includes('grafana') &&
      !service.name.includes('prometheus') &&
      !service.name.includes('alertmanager') &&
      !service.name.includes('tekton-dashboard'),
  )

  const {
    data: teamSealedSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })

  const teamSecrets = teamSealedSecrets?.filter((secret) => secret.type === 'kubernetes.io/tls') || []

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetchService()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingK8sServices) refetchK8sServices()
  }, [isDirty])

  // form state
  const methods = useForm<CreateServiceApiResponse>({
    resolver: yupResolver(serviceApiResponseSchema) as Resolver<CreateServiceApiResponse>,
    defaultValues: data,
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
    if (data) {
      console.log('DATA: ', data)
      reset(data)
      setActiveService(data.name)
    }

    if (!isEmpty(data?.ingress?.paths)) {
      data.ingress.paths.forEach((path, index) => {
        if (path.includes('/')) setValue(`ingress.paths.${index}`, path.replace(/^\/+/, ''))
      })
    }
    setValue('ingress.domain', cluster.domainSuffix)
  }, [data, setValue])

  useEffect(() => {
    setUrl(getKeyValue(service))
  }, [service])

  const TLSEnabled = watch('ingress.tlsPass')
  const TrafficControlEnabled = watch('trafficControl.enabled')

  function setActiveService(name: string) {
    const activeService = filteredK8Services?.find((service) => service.name === name) as unknown as K8Service
    setService(activeService)
    if (activeService?.managedByKnative) setValue('ksvc.predeployed', true)
    else setValue('ksvc.predeployed', false)
  }

  const onSubmit = (submitData: CreateServiceApiResponse) => {
    if (!isEmpty(submitData.ingress.paths)) {
      submitData.ingress.paths.forEach((path, index) => {
        submitData.ingress.paths[index] = `/${path}`
      })
    }
    if (submitData.ksvc?.predeployed) {
      if (submitData.ingress.subdomain !== `${service.name}-team-${teamId}`)
        submitData.ingress.subdomain = `${submitData.ingress.subdomain}-team-${teamId}`
    } else if (submitData.ingress.subdomain !== `${service.name}-${teamId}`)
      submitData.ingress.subdomain = `${submitData.ingress.subdomain}-${teamId}`

    // eslint-disable-next-line object-shorthand
    if (serviceName) update({ teamId, serviceName: serviceName, body: submitData })
    else create({ teamId, body: submitData })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/services`} />

  const loading = isLoading || isLoadingK8sServices || isLoadingTeamSecrets
  const error = isError || isErrorK8sServices || isErrorTeamSecrets

  if (loading) return <PaperLayout loading title={t('TITLE_SERVICE')} />

  if (teamId !== 'admin') setValue('namespace', `team-${teamId}`)

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SERVICE')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/for-devs/console/services'
          title='Service'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General'>
              <FormRow spacing={10}>
                {teamId === 'admin' && (
                  <TextField
                    label='Namespace'
                    width='large'
                    {...register('namespace')}
                    error={!!errors.namespace}
                    helperText={errors.namespace?.message?.toString()}
                  />
                )}
              </FormRow>
              <FormRow key={1} spacing={10}>
                <TextField
                  label='Service Name'
                  width='large'
                  {...register('name')}
                  select
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('name', value)
                    setValue('ingress.subdomain', value)
                    setActiveService(value)
                  }}
                  value={watch('name', data?.name)}
                >
                  <MenuItem key='select-a-service' value='' disabled classes={undefined}>
                    Select a service
                  </MenuItem>
                  {filteredK8Services?.map((service) => {
                    return (
                      <MenuItem key={service.name} value={service.name} classes={undefined}>
                        {service.name}
                      </MenuItem>
                    )
                  })}
                </TextField>
                <TextField
                  label='Port'
                  width='small'
                  {...register('port')}
                  select
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    setValue('port', value)
                  }}
                  value={watch('port') || ''}
                  error={!!errors.port}
                  helperText={errors.port?.message?.toString()}
                >
                  <MenuItem key='select-a-port' value='' disabled classes={undefined}>
                    Select a port
                  </MenuItem>
                  {service?.ports.map((port) => {
                    return (
                      <MenuItem key={`service-${port}`} value={port} classes={undefined}>
                        {port}
                      </MenuItem>
                    )
                  })}
                </TextField>
              </FormRow>
            </Section>
            <Section title='Service Exposure'>
              <FormRow spacing={10}>
                <TextField label='URL' width='large' disabled value={url} />
              </FormRow>
              <Divider sx={{ mt: 4, mb: 2 }} />
              <StyledAccordion disableGutters>
                <StyledAccordionSummary
                  expandIcon={<KeyboardArrowRight />}
                  aria-controls='advanced-settings-content'
                  id='advanced-settings-header'
                  sx={{
                    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                      transform: 'rotate(90deg)',
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '16px' }}>
                    Advanced Settings
                  </Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <KeyValue
                    title='URL paths'
                    subTitle='These define where your service is available. For example, login could point to your app’s login page.'
                    keyDisabled
                    keyValue={url}
                    keyLabel='Domain'
                    valueLabel='Path'
                    showLabel={false}
                    addLabel='Add another URL path'
                    onlyValue
                    keySize='large'
                    valueSize='medium'
                    name='ingress.paths'
                    error={!!errors.ingress?.paths}
                    helperText={errors.ingress?.paths?.root?.message?.toString()}
                    {...register('ingress.paths')}
                  />

                  <Divider sx={{ mt: 4, mb: 2 }} />
                  <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>
                    Domain aliases (CNAME)
                  </Typography>
                  <Typography sx={{ fontSize: '12px' }}>
                    You can have multiple urls directing to the same url as above . You need to make sure that the DNS
                    provider where your URL is hosted is pointing to this IP-Adres: 172.0.0.1
                  </Typography>
                  <FormRow key={1} spacing={10}>
                    <TextField
                      label='Domain'
                      error={!!errors.ingress?.cname}
                      helperText={errors.ingress?.cname?.root?.message?.toString()}
                      width='large'
                      type='text'
                      {...register('ingress.cname.domain')}
                    />
                    <TextField
                      label='TLS Secret'
                      width='medium'
                      {...register('ingress.cname.tlsSecretName')}
                      select
                      error={!!errors.ingress?.cname}
                      onChange={(e) => {
                        const value = e.target.value
                        setValue('ingress.cname.tlsSecretName', value)
                      }}
                      value={watch('ingress.cname.tlsSecretName') || ''}
                    >
                      <MenuItem key='tls-certificate' value={undefined} classes={undefined}>
                        TLS certificate
                      </MenuItem>
                      {teamSecrets.map((secret) => {
                        return (
                          <MenuItem key={secret?.name} value={secret?.name} classes={undefined}>
                            {secret?.name}
                          </MenuItem>
                        )
                      })}
                    </TextField>
                  </FormRow>

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <TextField
                    label='Ingress Class Name'
                    fullWidth
                    {...register('ingress.ingressClassName')}
                    width='large'
                    value='platform'
                    select
                  >
                    <MenuItem key='platform' id='platform' value='platform' classes={undefined}>
                      platform
                    </MenuItem>
                  </TextField>

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    name='ingress.tlsPass'
                    control={control}
                    label='TLS Passthrough'
                    explainertext='Requests will be forwarded to the backend service without being decrypted'
                  />

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    disabled={TLSEnabled}
                    name='ingress.forwardPath'
                    control={control}
                    label='Forward Path'
                    explainertext='URL will be forwarded to the complete url path (.e.g /api/users) instead of ‘/’'
                  />

                  <ControlledCheckbox
                    sx={{ my: 2 }}
                    disabled={TLSEnabled}
                    name='trafficControl.enabled'
                    control={control}
                    label='Enable Traffic Mangement'
                    explainertext='Split traffic between two versions (A/B testing, canary). (Enable this feature only if you have two
                    deployments behind that service)'
                  />
                  <LinkedNumberField
                    registers={{
                      registerA: { ...register('trafficControl.weightV1') },
                      registerB: { ...register('trafficControl.weightV2') },
                      setValue,
                      watch,
                    }}
                    labelA='Version A'
                    labelB='Version B'
                    valueMax={100}
                    disabled={!TrafficControlEnabled}
                    error={!!errors.trafficControl?.weightV1 || !!errors.trafficControl?.weightV2}
                    helperText={
                      errors.trafficControl?.weightV1 || errors.trafficControl?.weightV2
                        ? 'The values must be in a range of "0" and "100"'
                        : undefined
                    }
                  />

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <KeyValue
                    title='HTTP Response Headers'
                    keyLabel='Name'
                    valueLabel='Value'
                    addLabel='Add another response header'
                    name='ingress.headers.response.set'
                    error={!!errors.ingress?.headers}
                    helperText={errors.ingress?.headers ? '"Name" and "Value" must both be filled in' : undefined}
                    {...register('ingress.headers.response.set')}
                  />
                </StyledAccordionDetails>
              </StyledAccordion>
            </Section>
            <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '12px', marginRight: '10px' }}>
                Your service will be {serviceName ? 'edited' : 'created'} as: {url}
              </Typography>
              {serviceName && (
                <DeleteButton
                  onDelete={() => del({ teamId, serviceName })}
                  resourceName={watch('name')}
                  resourceType='service'
                  data-cy='button-delete-service'
                  sx={{ marginRight: '10px', textTransform: 'capitalize', ml: 2 }}
                />
              )}
              <Button
                disabled={isEmpty(service)}
                type='submit'
                variant='contained'
                color='primary'
                sx={{ textTransform: 'none' }}
              >
                {serviceName ? 'Edit Service' : 'Create Service'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
