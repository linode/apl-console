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
import Iconify from 'components/Iconify'
import { KeyboardArrowRight } from '@mui/icons-material'
import { Typography } from 'components/Typography'
import KeyValue from 'components/forms/KeyValue'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { isEmpty } from 'lodash'
import LinkedNumberField from 'components/forms/LinkedNumberField'
import KeyValueSingle from 'components/forms/KeyValueSingle'
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

export default function ({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const history = useHistory()
  const location = useLocation()
  console.log('LOCATION: ', location)
  const session = useSession()
  console.log('SESSION: ', session)
  const locationState = location?.state as any
  const prefilledData = locationState?.prefilled as CreateServiceApiResponse
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()
  const [service, setService] = useState<string | undefined>(undefined)

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

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetchService()
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
  } = methods

  useEffect(() => {
    if (data) {
      reset(data)
      setService(watch('name'))
    }

    if (!isEmpty(prefilledData)) {
      reset(prefilledData)
      setService(prefilledData.name)
    }
  }, [data, setValue, prefilledData])
  const TLSEnabled = watch('ingress.tlsPass')
  const TrafficControlEnabled = watch('trafficControl.enabled')

  console.log('methods', methods)
  function setActiveService(name: string) {
    setService(services.find((service) => service.name === name).name)
  }

  const onSubmit = (data: CreateServiceApiResponse) => {
    console.log('DATA: ', data)
    // eslint-disable-next-line object-shorthand
    if (serviceId) update({ teamId, serviceId: serviceId, body: data })
    else create({ teamId, body: data })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/services`} />

  const loading = isLoading || isLoadingK8sServices
  const error = isError || isErrorK8sServices

  if (loading) return <PaperLayout loading title={t('TITLE_SERVICE')} />
  // DEMO VALUES
  const namespaces = ['team-admin', 'team-demo', 'team-demo2']
  console.log('services: ', k8sServices)
  console.log('ACTIVE SERVICE: ', service)
  const services = [
    { name: 'demo', ports: 80 },
    { name: 'blue', ports: 1001 },
    { name: 'green', ports: 91 },
    { name: 'the-moon', ports: 8080 },
  ]
  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SERVICE')}>
        <LandingHeader docsLabel='Docs' docsLink='https://apl-docs.net/docs/get-started/overview' title='Service' />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General'>
              <FormRow spacing={10}>
                {teamId === 'admin' ? (
                  <TextField
                    label='Namespace'
                    width='large'
                    select
                    {...register('namespace')}
                    onChange={(e) => {
                      const value = e.target.value
                      setValue('name', value)
                      setValue('ingress.subdomain', `${value}.${teamId}`)
                    }}
                  >
                    <MenuItem value='namespace' disabled classes={undefined}>
                      Select a namespace
                    </MenuItem>
                    {namespaces.map((namespace) => {
                      return (
                        <MenuItem value={namespace} classes={undefined}>
                          {namespace}
                        </MenuItem>
                      )
                    })}
                  </TextField>
                ) : (
                  <TextField
                    label='Namespace'
                    width='large'
                    value={`team-${teamId}`}
                    disabled
                    {...register('namespace')}
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
                    setActiveService(value)
                  }}
                  value={watch('name')}
                >
                  <MenuItem value='' disabled classes={undefined}>
                    Select a service
                  </MenuItem>
                  {services.map((service) => {
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
                  error={!!errors.port}
                  helperText={errors.port?.message?.toString()}
                />
              </FormRow>
            </Section>
            <Section title='Service Exposure'>
              <FormRow spacing={10}>
                <TextField
                  label='URL'
                  width='large'
                  disabled
                  value={
                    service !== undefined
                      ? `https://${service}-${cluster.domainSuffix}/`
                      : `https://*-${cluster.domainSuffix}/`
                  }
                />
                <Iconify
                  icon='eva:question-mark-circle-outline'
                  sx={{ width: '24px', height: '24px', color: '#83868B' }}
                />
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
                    keyValue={
                      service !== undefined ? `${service}-${cluster.domainSuffix}/` : `*-${cluster.domainSuffix}/`
                    }
                    keyLabel='Domain'
                    valueLabel='Path'
                    showLabel={false}
                    addLabel='Add another URL path'
                    onlyValue
                    name='ingress.paths'
                    {...register('ingress.paths')}
                  />

                  {/* {ingressType === 'public' && <PublicIngressForm />} */}

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <KeyValueSingle
                    title='Domain alias (CNAME)'
                    subTitle='You can have multiple urls directing to the same url as above. You need to make sure that the DNS provider where your URL is hosted is pointing to this IP-Adres: 172.0.0.1'
                    keyLabel='domain'
                    valueLabel='tlsSecretName'
                    name='ingress.cname'
                    registers={{
                      registerA: { ...register('ingress.cname.domain') },
                      registerB: { ...register('ingress.cname.tlsSecretName') },
                    }}
                  />

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
