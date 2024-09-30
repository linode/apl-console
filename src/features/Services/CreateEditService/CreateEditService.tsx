// @ts-nocheck
import { Button, MenuItem, Typography } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { RouteComponentProps } from 'react-router-dom'
import {
  CreateServiceApiResponse,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetServiceQuery,
} from 'redux/otomiApi'
import { createServiceApiResponseSchema } from './CreateEditServiceValidator'
import PublicIngressForm from './PublicIngressForm'

const useStyles = makeStyles()((theme: Theme) => ({
  paperLayout: {
    backgroundColor: 'white',
    padding: '20px',
  },
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

  const methods = useForm<any>({
    resolver: yupResolver(createServiceApiResponseSchema),
    defaultValues: {
      ingress: { type: 'cluster' },
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods

  const ingressType = watch('ingress.type')

  // console.log('halo ingress watch', watch('ingress'))
  // console.log('halo errror state', errors)

  const onSubmit = (data: CreateServiceApiResponse) => {
    console.log('halo reach submit', data)
    create({ teamId, body: data })
  }

  /** JSX */
  return (
    <div>
      <LandingHeader
        docsLabel='Docs'
        docsLink='https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/'
        title='Create Cluster'
      />
      <PaperLayout>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.paperLayout}>
            <Typography variant='h5'>Create Service</Typography>

            <TextField
              label='Service Name'
              fullWidth
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label='Port'
              type='number'
              fullWidth
              {...register('port')}
              error={!!errors.port}
              helperText={errors.port?.message}
            />

            <TextField
              label='Ingress Type'
              select
              fullWidth
              {...register('ingress.type')}
              error={!!errors.ingress?.type}
              helperText={errors.ingress?.type?.message}
            >
              <MenuItem value='cluster'>Cluster</MenuItem>
              <MenuItem value='public'>Public</MenuItem>
            </TextField>

            {ingressType === 'public' && <PublicIngressForm />}

            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </div>
  )
}
