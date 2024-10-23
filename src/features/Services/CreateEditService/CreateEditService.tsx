// @ts-nocheck
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, MenuItem, styled } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateServiceApiResponse,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetServiceQuery,
} from 'redux/otomiApi'
import FormRow from 'components/forms/FormRow'
import { Paper } from 'components/Paper'
import { Divider } from 'components/Divider'
import KeyValue from 'components/forms/KeyValue'
import { KeyboardArrowRight } from '@mui/icons-material'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { createServiceApiResponseSchema } from './CreateEditServiceValidator'

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    '& .mlMain': {
      flexBasis: '100%',
      maxWidth: '100%',
      [theme.breakpoints.up('lg')]: {
        flexBasis: '78.8%',
        maxWidth: '78.8%',
      },
    },
    '& .mlSidebar': {
      flexBasis: '100%',
      maxWidth: '100%',
      position: 'static',
      [theme.breakpoints.up('lg')]: {
        flexBasis: '21.2%',
        maxWidth: '21.2%',
        position: 'sticky',
      },
      width: '100%',
    },
  },
}))

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

export default function CreateEditService({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  /** Data Layer */
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateServiceMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditServiceMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteServiceMutation()
  const {
    data,
    isLoading: isLoadingService,
    isFetching: isFetchingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })

  const { classes } = useStyles()
  const theme = useTheme()

  const defaultValues = {
    ingress: {
      type: 'public',
      ingressClassName: 'platform',
      domain: 'try-otomi.net',
    },
  }

  const methods = useForm<any>({
    resolver: yupResolver(createServiceApiResponseSchema),
    defaultValues: data || defaultValues,
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

  const TLSEnabled = watch('ingress.tlsPass')

  useEffect(() => {
    if (data) reset(data)
  }, [data])

  console.log('halo watcher', watch())
  console.log('halo formstate errors', errors)

  const onSubmit = (data: CreateServiceApiResponse) => {
    if (serviceId) update({ teamId, serviceId, body: data })
    else create({ teamId, body: data })
  }

  if (isSuccessCreate || isSuccessUpdate) return <Redirect to={`/teams/${teamId}/services`} />

  /** JSX */
  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/'
          title='Service Exposure'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
              <Typography variant='h2'>General</Typography>
              <FormRow spacing='10'>
                <TextField
                  label='Service Name'
                  fullWidth
                  {...register('name')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('name', value)
                    setValue('ingress.subdomain', `${value}.${teamId}`)
                  }}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  width='large'
                />

                <TextField
                  label='Port'
                  type='number'
                  fullWidth
                  {...register('port')}
                  error={!!errors.port}
                  helperText={errors.port?.message}
                  width='small'
                />
              </FormRow>
            </Paper>

            <Paper>
              <Typography variant='h2'>Service Exposure</Typography>
              <TextField
                label='URL'
                fullWidth
                error={!!errors.ingress?.subdomain}
                helperText={errors.ingress?.subdomain?.message}
                width='large'
                value={`https://${watch('name')}.${teamId}.try-otomi.net`}
                disabled
              />

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
                  <Typography sx={{ fontWeight: 'bold', color: 'white' }}>Advanced Settings</Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <KeyValue
                    title='URL paths'
                    subTitle='These define where your service is available. For example, /login could point to your app’s login page.'
                    keyLabel='Domain'
                    valueLabel='Path'
                    addLabel='Add another URL path'
                    name='ingress.paths'
                    onlyValue
                    {...register('ingress.paths')}
                  />

                  {/* {ingressType === 'public' && <PublicIngressForm />} */}

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <KeyValue
                    title='Domain alias (CNAME)'
                    subTitle='you can have another url direct to the same url as above. You need to make sure that the DNS provider where your URL is hosted is pointing to this IP-Adres'
                    keyLabel='Domain'
                    valueLabel='TLS Certificate'
                    name='ingress.cname'
                    {...register('ingress.cname')}
                  />

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <TextField
                    label='Ingress Class Name'
                    fullWidth
                    {...register('ingress.ingressClassName')}
                    error={!!errors.ingress?.type}
                    helperText={errors.ingress?.type?.message}
                    width='large'
                    value='platform'
                    select
                  >
                    <MenuItem id='platform' value='platform'>
                      platform
                    </MenuItem>
                  </TextField>

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <ControlledCheckbox
                    name='ingress.tlsPass'
                    control={control}
                    label='TLS Passthrough'
                    explainerText='requests will be forwarded to the backend service without being decrypted'
                  />

                  <ControlledCheckbox
                    disabled={TLSEnabled}
                    name='ingress.forwardPath'
                    control={control}
                    label='Forward Path'
                    explainerText='URL will be forwarded to the complete url path (.e.g /api/users) instead of ‘/’'
                  />

                  <ControlledCheckbox
                    disabled={TLSEnabled}
                    name='trafficControl.enabled'
                    control={control}
                    label='Enable Traffic Mangement'
                    explainerText='Split traffic between two versions (A/B testing, canary). (Enable this feature only if you have two
                    deployments behind that service)'
                  />

                  <Divider sx={{ mt: 4, mb: 2 }} />

                  <KeyValue
                    title='HTTP Response Headers'
                    keyLabel='name'
                    valueLabel='value'
                    addLabel='Add another response header'
                    name='ingress.headers.response.set'
                    {...register('ingress.headers.response.set')}
                  />
                </StyledAccordionDetails>
              </StyledAccordion>
            </Paper>

            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right' }}>
              Expose Service
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
