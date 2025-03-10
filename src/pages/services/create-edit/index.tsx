import { Accordion, AccordionDetails, AccordionSummary, Button, Divider, Grid } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
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
  serviceId?: string
}

interface K8Service {
  name: string
  ports: number[]
  managedByKnative: boolean
}

interface K8Secret {
  name: string
}

export default function ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  // DEMO VALUES
  const services: K8Service[] = [
    { name: 'demo', ports: [80], managedByKnative: false },
    { name: 'blue', ports: [1001], managedByKnative: true },
    { name: 'green', ports: [91], managedByKnative: true },
    { name: 'the-moon', ports: [8080], managedByKnative: false },
  ]

  const localTeamSecrets = [
    { name: 'tls-secret-1' },
    { name: 'tls-secret-2' },
    { name: 'tls-secret-3' },
    { name: 'tls-secret-4' },
  ]
  const history = useHistory()
  const location = useLocation()
  const session = useSession()
  const locationState = location?.state as any
  const prefilledData = locationState?.prefilled as CreateServiceApiResponse
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()
  const [service, setService] = useState<K8Service | undefined>(undefined)
  const [secret, setSecret] = useState<K8Secret | undefined>(undefined)

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
  } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })
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

  const teamSecrets = teamSealedSecrets?.filter((secret) => secret.type === 'kubernetes.io/tls') || []

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetchService()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
    if (!isFetchingK8sServices) refetchK8sServices()
  }, [isDirty])

  // form state
  const defaultValues = { ...prefilledData }
  const methods = useForm<CreateServiceApiResponse>({
    resolver: yupResolver(serviceApiResponseSchema) as Resolver<CreateServiceApiResponse>,
    defaultValues: data || defaultValues,
  })
  const {
    control,
    register,
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    trigger,
    getValues,
  } = methods
  console.log(errors.ingress?.paths)
  useEffect(() => {
    if (data) {
      reset(data)
      setActiveService(data.name)
      setService(k8sServices?.find((service) => service.name === data.name) as unknown as K8Service)
      setSecret(teamSecrets?.find((secret) => secret.name === data.name))
    }

    if (!isEmpty(prefilledData)) {
      console.log('PREFILLED')
      reset(prefilledData)
      setActiveService(prefilledData.name)
      setService(k8sServices?.find((service) => service.name === prefilledData.name) as unknown as K8Service)
      setSecret(teamSecrets?.find((secret) => secret.name === prefilledData.name))
      if (!isEmpty(prefilledData.ingress.paths)) {
        prefilledData.ingress.paths.forEach((path, index) => {
          prefilledData.ingress.paths[index] = path.replace(/^\/+/, '')
        })
      }
    }
  }, [data, setValue, prefilledData])
  const TLSEnabled = watch('ingress.tlsPass')
  const TrafficControlEnabled = watch('trafficControl.enabled')

  function setActiveService(name: string) {
    const activeService = k8sServices.find((service) => service.name === name) as unknown as K8Service
    setService(activeService)
    if (activeService?.managedByKnative) setValue('ksvc.predeployed', true)
    else setValue('ksvc.predeployed', false)
  }

  function setActiveSecret(name: string) {
    setSecret(teamSecrets.find((secret) => secret.name === name))
  }

  const onSubmit = (data: CreateServiceApiResponse) => {
    console.log('data', data)
    if (isEmpty(data.ingress.cname.tlsSecretName) || isEmpty(data.ingress.cname.domain)) data.ingress.cname = {}
    if (isEmpty(data.ingress.headers.response.set)) data.ingress.headers = {}
    // if (!isEmpty(data.ingress.paths)) {
    //   data.ingress.paths.forEach((path, index) => {
    //     data.ingress.paths[index] = `/${path}`
    //   })
    // }
    console.log('MODIFIED data', data)
    // eslint-disable-next-line object-shorthand
    if (serviceId) update({ teamId, serviceId: serviceId, body: data })
    else create({ teamId, body: data })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/services`} />

  const loading = isLoading || isLoadingK8sServices || isLoadingTeamSecrets
  const error = isError || isErrorK8sServices || isErrorTeamSecrets

  if (loading) return <PaperLayout loading title={t('TITLE_SERVICE')} />
  setValue('ingress.domain', `${cluster.domainSuffix}/`)
  if (teamId !== 'admin') setValue('namespace', `team-${teamId}`)

  const getKeyValue = () => {
    if (service !== undefined) {
      return service.managedByKnative
        ? `${service.name}-team-${teamId}.${cluster.domainSuffix}/`
        : `${service.name}-${teamId}.${cluster.domainSuffix}/`
    }
    return `*-${teamId}.${cluster.domainSuffix}/`
  }

  console.log('methods: ', methods)

  const keyValue = getKeyValue()

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SERVICE')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/get-started/labs/expose-services'
          title='Service'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General'>
              <FormRow spacing={10}>
                {teamId === 'admin' && <TextField label='Namespace' width='large' {...register('namespace')} />}
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
                  value={watch('name')}
                >
                  <MenuItem value='' disabled classes={undefined}>
                    Select a service
                  </MenuItem>
                  {k8sServices.map((service) => {
                    return (
                      <MenuItem value={service.name} classes={undefined}>
                        {service.name}
                      </MenuItem>
                    )
                  })}
                </TextField>
                <TextField
                  label='Port'
                  width='small'
                  type='number'
                  {...register('port')}
                  min={1}
                  max={65535}
                  helperTextPosition='top'
                  error={!!errors.port}
                  helperText={errors.port?.message?.toString()}
                />
              </FormRow>
            </Section>
            <Section title='Service Exposure'>
              <FormRow spacing={10}>
                <TextField label='URL' width='large' disabled value={keyValue} />
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
                    subTitle='These define where your service is available. For example, /login could point to your app’s login page.'
                    keyDisabled
                    keyValue={keyValue}
                    keyLabel='Domain'
                    valueLabel='Path'
                    showLabel={false}
                    addLabel='Add another URL path'
                    onlyValue
                    name='ingress.paths'
                    error={!!errors.ingress?.paths}
                    helperText={errors.ingress?.paths?.root?.message?.toString()}
                    {...register('ingress.paths')}
                  />

                  <Divider sx={{ mt: 4, mb: 2 }} />
                  <FormRow key={1} spacing={10}>
                    <TextField
                      label='Domain'
                      error={!!errors.ingress?.cname}
                      helperText={errors.ingress?.cname?.root?.message?.toString()}
                      width='medium'
                      type='text'
                      {...register('ingress.cname.domain')}
                    />
                    <TextField
                      label='TLS Secret'
                      width='medium'
                      {...register('ingress.cname.tlsSecretName')}
                      select
                      error={!!errors.ingress?.cname}
                      helperText={errors.ingress?.cname?.root?.message?.toString()}
                      onChange={(e) => {
                        const value = e.target.value
                        setValue('ingress.cname.tlsSecretName', value)
                        setActiveSecret(value)
                      }}
                      value={watch('ingress.cname.tlsSecretName')}
                    >
                      <MenuItem value='' classes={undefined}>
                        TLS certificate
                      </MenuItem>
                      {teamSecrets.map((secret) => {
                        return (
                          <MenuItem value={secret.name} classes={undefined}>
                            {secret.name}
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
                    <MenuItem id='platform' value='platform' classes={undefined}>
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
            {serviceId && (
              <DeleteButton
                onDelete={() => del({ teamId, serviceId })}
                resourceName={watch('name')}
                resourceType='service'
                data-cy='button-delete-service'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
              />
            )}
            <Button
              disabled={isEmpty(service)}
              type='submit'
              variant='contained'
              color='primary'
              sx={{ float: 'right', textTransform: 'none' }}
            >
              {serviceId ? 'Edit Service' : 'Add Service'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
