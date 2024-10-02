// @ts-nocheck
import { Button, Grid, MenuItem, styled } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { Checkbox } from 'components/cmCheckbox/Checkbox'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { FormControlLabel } from 'components/FormControlLabel'
import { Typography } from 'components/Typography'
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
const StyledTypography = styled(Typography, { label: 'StyledTypography' })(({ theme }) => ({
  marginTop: -8,
  paddingLeft: `calc(${theme.spacing(2)} + 18px)`, // 34,
  [theme.breakpoints.up('md')]: {
    paddingLeft: `calc(${theme.spacing(4)} + 18px)`, // 50
  },
}))

const StyledFormControlLabel = styled(FormControlLabel, {
  label: 'StyledFormControlLabel',
})(({ theme }) => ({
  '& > span:last-child': {
    color: theme.palette.cm.headline,
    fontFamily: theme.font.bold,
    fontSize: '1rem',
    lineHeight: '1.2em',
    [theme.breakpoints.up('md')]: {
      marginLeft: theme.spacing(2),
    },
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
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/'
          title='Create Cluster'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.paperLayout}>
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

            <StyledFormControlLabel
              control={<Checkbox checked data-qa-check-private-ip data-testid='private_ip' disabled={false} />}
              label='Private IP'
            />
            <StyledTypography data-testid='private-ip-contextual-copy' variant='body1'>
              Use Private IP for a backend node to a NodeBalancer. Use VPC instead for private communication between
              your Linodes.
            </StyledTypography>

            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
