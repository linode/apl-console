// @ts-nocheck
import {
  RHFCheckbox,
  RHFKeyValue,
  RHFSingleValue,
  RHFSlider,
  RHFTextField,
  SectionCard,
  SectionDivider,
  SelectableCard,
} from 'components/forms'
import { omit } from 'lodash'
import { FormContainer } from 'react-hook-form-mui'
import { Controller, useForm } from 'react-hook-form'
import { CSSTransition } from 'react-transition-group'
import { makeStyles } from '@mui/styles'
import PaperLayout from 'layouts/Paper'
import { RouteComponentProps } from 'react-router-dom'
import { Box, FormGroup, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { useCreateServiceMutation, useGetServiceQuery } from 'redux/otomiApi'

const useStyles = makeStyles({
  transitionWrapper: {
    overflow: 'hidden',
    transition: 'max-height 0.5s ease, opacity 0.5s ease',
    maxHeight: 0, // Initial collapsed height
    opacity: 0,
  },
  transitionEnter: {
    maxHeight: 0, // Before entering, it's collapsed
    opacity: 0,
  },
  transitionEnterActive: {
    maxHeight: 5000, // Expanded height, adjust as needed
    opacity: 1,
  },
  transitionExit: {
    maxHeight: 5000, // Before exiting, it's expanded
    opacity: 1,
  },
  transitionExitActive: {
    maxHeight: 0,
    opacity: 0,
  },
})
interface Params {
  teamId: string
  serviceId?: string
}

export default function ServiceEditPage({
  match: {
    params: { teamId, serviceId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const [create] = useCreateServiceMutation()
  const {
    data,
    isLoading: isLoadingService,
    isFetching: isFetchingService,
    isError: isErrorService,
    refetch: refetchService,
  } = useGetServiceQuery({ teamId, serviceId }, { skip: !serviceId })
  const formContext = useForm()
  const { reset } = formContext
  useEffect(() => {
    console.log('params?', teamId, serviceId)
    if (data) {
      console.log('new data', data)
      reset(data)
    }
  }, [data])

  console.log('formcontext', formContext.formState.defaultValues)
  const classes = useStyles()
  const {
    control,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = formContext

  const isTrafficControlEnabled = watch('trafficControlEnabled')

  const [ingress, setIngress] = useState('cluster')
  const [useCname, setUseCname] = useState(false)
  const [ingressClassName, setIngressClassName] = useState('platform')

  // all the handlers are here ------------------------------------

  const handleCardClick = (value) => {
    setIngress(value)
  }

  const handleCnameClick = () => {
    console.log('halo reach')
    setUseCname(!useCname)
  }

  const handleIngressClassNameCardClick = (value) => {
    setIngressClassName(value)
  }

  /// ------------------------------------------------------------

  const [versionA, setVersionA] = useState(50)
  const versionB = 100 - versionA

  const handleSliderChange = (event, newValue) => {
    setVersionA(newValue)
  }

  const onSubmit = (data, event) => {
    const cleanedData = { ...data }

    if (data.ingress.type === 'cluster') {
      cleanedData.ingress = omit(data.ingress, [
        'ingressClassName',
        'tlsPass',
        'useDefaultHost',
        'subdomain',
        'domain',
        'useCname',
        'cname',
        'forwardPath',
        'hasCert',
        'httpHeaders',
      ])
    }

    if (!data.ingress.useCname) cleanedData.ingress = omit(cleanedData.ingress, ['cname'])

    create({ id: 'admin', body: cleanedData })
  }

  if (isLoadingService || isFetchingService) return <div>Loading...</div>

  return (
    <PaperLayout title='New Service'>
      <Typography variant='h4' sx={{ marginLeft: '3px', mt: 3, mb: 3 }}>
        New Service (team admin)
      </Typography>
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <RHFTextField required name='name' label='name' sx={{ width: '400px', marginLeft: '3px' }} />
        <RHFTextField type='number' name='port' label='port' sx={{ width: '200px', ml: 1 }} />

        <SectionCard title='Traffic control' subTitle='Split traffic between multiple versions (blue-green, canary).'>
          <Controller
            name='trafficControlEnabled'
            control={control}
            defaultValue={false}
            render={({ field }) => <RHFCheckbox {...field} id='trafficControlEnabled' name='enabled' label='Enabled' />}
          />
          <CSSTransition
            in={isTrafficControlEnabled}
            timeout={1000}
            classNames={{
              enter: classes.transitionEnter,
              enterActive: classes.transitionEnterActive,
              exit: classes.transitionExit,
              exitActive: classes.transitionExitActive,
            }}
            unmountOnExit
          >
            <div
              className={`${classes.transitionWrapper} ${
                isTrafficControlEnabled ? classes.transitionEnterActive : classes.transitionExitActive
              }`}
            >
              <RHFSlider name='trafficSlider' label='trafficSlider' onChange={handleSliderChange} />
              <Box display='flex' alignItems='center'>
                <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
                  <Typography variant='h6'>Version A</Typography>
                  <Box
                    width={50}
                    height={200}
                    position='relative'
                    border='1px solid #4E49B2'
                    borderRadius='12px'
                    display='flex'
                    alignItems='flex-end'
                    justifyContent='center'
                  >
                    <Box
                      width='100%'
                      height={`${versionA}%`}
                      bgcolor='#4E49B2'
                      transition='height 0.3s ease'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      color='white'
                      sx={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}
                    >
                      <Typography variant='body2'>{`${versionA}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box flex={1} display='flex' flexDirection='column' alignItems='center'>
                  <Typography variant='h6'>Version B</Typography>
                  <Box
                    width={50}
                    height={200}
                    position='relative'
                    border='1px solid #57A97C'
                    borderRadius='12px'
                    display='flex'
                    alignItems='flex-end'
                    justifyContent='center'
                  >
                    <Box
                      width='100%'
                      height={`${versionB}%`}
                      bgcolor='#57A97C'
                      transition='height 0.3s ease'
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                      color='white'
                      sx={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}
                    >
                      <Typography variant='body2'>{`${versionB}%`}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </div>
          </CSSTransition>
        </SectionCard>

        <SectionCard
          title='Exposure (ingress)'
          subTitle='Determines loadbalancer related configuration for handling the service ingress.'
        >
          <Controller
            name='ingress.type'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Box display='flex'>
                <SelectableCard
                  title='Private'
                  selected={ingress === 'cluster'}
                  onClick={() => {
                    field.onChange('cluster')
                    handleCardClick('cluster')
                  }}
                />
                <SelectableCard
                  title='External'
                  selected={ingress === 'public'}
                  onClick={() => {
                    field.onChange('public')
                    handleCardClick('public')
                  }}
                />
              </Box>
            )}
          />
          <CSSTransition
            in={ingress === 'public'}
            timeout={1000}
            classNames={{
              enter: classes.transitionEnter,
              enterActive: classes.transition,
              exit: classes.transitionExit,
              exitActive: classes.transition,
            }}
            unmountOnExit
          >
            <div
              className={`${classes.transitionWrapper} ${
                ingress === 'public' ? classes.transitionEnterActive : classes.transitionExitActive
              }`}
            >
              <SectionDivider />
              <Typography variant='h5'>External exposure options</Typography>
              <FormGroup>
                <Typography variant='h6' sx={{ mt: 2, fontWeight: 'normal' }}>
                  Ingress Class name
                </Typography>
                <Controller
                  name='ingress.ingressClassName'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <Box display='flex'>
                      <SelectableCard
                        title='platform'
                        selected={ingressClassName === 'platform'}
                        onClick={() => {
                          field.onChange('platform')
                          handleIngressClassNameCardClick('platform')
                        }}
                      />
                      <SelectableCard
                        title='private'
                        selected={ingressClassName === 'private'}
                        onClick={() => {
                          field.onChange('private')
                          handleIngressClassNameCardClick('private')
                        }}
                      />
                      <SelectableCard
                        title='net-a'
                        selected={ingressClassName === 'net-a'}
                        onClick={() => {
                          field.onChange('net-a')
                          handleIngressClassNameCardClick('net-a')
                        }}
                      />
                    </Box>
                  )}
                />
                <Controller
                  name='ingress.tlsPass'
                  control={control}
                  render={({ field }) => <RHFCheckbox {...field} id='TLS' label='TLS passthrough' />}
                />
                <Controller
                  name='ingress.useDefaultHost'
                  control={control}
                  render={({ field }) => <RHFCheckbox {...field} id='defaultHost' label='Use default host' />}
                />
                <RHFTextField name='ingress.subdomain' id='subdomain' label='host' sx={{ width: '200px' }} />
                <RHFTextField name='ingress.domain' id='domain' label='DNS Zone' sx={{ width: '200px' }} />
                <Controller
                  name='ingress.useCname'
                  control={control}
                  render={({ field }) => (
                    <RHFCheckbox
                      {...field}
                      id='useCname'
                      label='Use CNAME'
                      onChange={() => {
                        handleCnameClick()
                      }}
                    />
                  )}
                />
                <CSSTransition
                  in={useCname}
                  timeout={1000}
                  classNames={{
                    enter: classes.transitionEnter,
                    enterActive: classes.transition,
                    exit: classes.transitionExit,
                    exitActive: classes.transition,
                  }}
                  unmountOnExit
                >
                  <RHFTextField
                    name='ingress.cname.domain'
                    id='cnameDomain'
                    label='domain'
                    sx={{ width: '200px' }}
                    required={useCname && ingress === 'public'}
                  />
                </CSSTransition>
                <SectionDivider />
                <Typography variant='h5'> URL paths</Typography>
                <RHFSingleValue />
                <Controller
                  name='ingress.forwardPath'
                  control={control}
                  render={({ field }) => <RHFCheckbox {...field} id='forwardPath' label='Forward Path' />}
                />
                <Controller
                  name='ingress.hasCert'
                  control={control}
                  render={({ field }) => (
                    <RHFCheckbox {...field} id='hasCertificate' label='Already has a certificate' />
                  )}
                />
              </FormGroup>
              <SectionDivider />
              <Typography variant='h5'>Http response headers</Typography>
              <RHFKeyValue />
            </div>
          </CSSTransition>
        </SectionCard>
        <Stack alignItems='flex-end' sx={{ mt: 3, mr: 1 }}>
          <LoadingButton type='submit' variant='contained' loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </FormContainer>
    </PaperLayout>
  )
}
