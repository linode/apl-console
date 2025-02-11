import { Box, Button, Grid, MenuItem } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import {
  CreateCoderepoApiResponse,
  useCreateCoderepoMutation,
  useDeleteCoderepoMutation,
  useEditCoderepoMutation,
  useGetCoderepoQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import FormRow from 'components/forms/FormRow'
import { Paper } from 'components/Paper'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { createCoderepoApiResponseSchema } from './create-edit.validator'

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

interface Params {
  teamId: string
  coderepoId?: string
}

export default function ({
  match: {
    params: { teamId, coderepoId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateCoderepoMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditCoderepoMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteCoderepoMutation()
  const {
    data,
    isLoading: isLoadingCoderepo,
    isFetching: isFetchingCoderepo,
    isError: isErrorCoderepo,
    refetch: refetchCoderepo,
  } = useGetCoderepoQuery({ teamId, coderepoId }, { skip: !coderepoId })

  const { classes } = useStyles()

  const defaultValues = {}

  const methods = useForm<CreateCoderepoApiResponse>({
    resolver: yupResolver(createCoderepoApiResponseSchema) as Resolver<CreateCoderepoApiResponse>,
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

  useEffect(() => {
    if (data) reset(data)
  }, [data, setValue])

  console.log({ data: watch(), errors })

  const onSubmit = (data: CreateCoderepoApiResponse) => {
    if (coderepoId) update({ teamId, coderepoId, body: data })
    else create({ teamId, body: data })
  }

  const onDelete = () => {
    if (coderepoId) del({ teamId, coderepoId })
  }

  if (isSuccessCreate || isSuccessUpdate) return <Redirect to={`/teams/${teamId}/coderepositories`} />

  return (
    <Grid className={classes.root}>
      <PaperLayout title={t('TITLE_CODEREPOSITORY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://www.linode.com/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/'
          title='Code Repository'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
              <Typography variant='h2'>General</Typography>
              <FormRow spacing={10}>
                <TextField
                  label='Internal Repo Name'
                  fullWidth
                  {...(register('name') as Pick<CreateCoderepoApiResponse, 'name'>)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('name', value)
                  }}
                  placeholder='Repo Name'
                  error={!!errors.name}
                  helperText={errors.name?.message?.toString()}
                />
              </FormRow>
            </Paper>

            <Paper>
              <Typography variant='h2'>Add a repository</Typography>
              <Box sx={{ my: 2, display: 'flex', gap: 2 }}>
                <Button variant='outlined' color='primary' sx={{ borderRadius: '8px', padding: '8px 16px' }}>
                  Gitea
                </Button>
                <Button variant='outlined' color='primary' sx={{ borderRadius: '8px', padding: '8px 16px' }}>
                  GitHub
                </Button>
                <Button variant='outlined' color='primary' sx={{ borderRadius: '8px', padding: '8px 16px' }}>
                  GitLab
                </Button>
              </Box>

              <ControlledCheckbox
                sx={{ my: 2 }}
                name='isPrivate'
                control={control}
                label='Private Repository'
                explainerText='Select if repository is private'
              />

              <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <TextField
                  label='Repository URL'
                  fullWidth
                  {...(register('url') as Pick<CreateCoderepoApiResponse, 'url'>)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('url', value)
                  }}
                  placeholder='Repository Url'
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  width='large'
                />
                <TextField
                  label='Sealed Secret'
                  fullWidth
                  {...(register('sealedSecret') as Pick<CreateCoderepoApiResponse, 'sealedSecret'>)}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('sealedSecret', value)
                  }}
                  placeholder='Sealed Secret'
                  error={!!errors.sealedSecret}
                  helperText={errors.sealedSecret?.message}
                  width='large'
                  value={`${watch('sealedSecret')}`}
                  select
                >
                  <MenuItem id='my-secret-1' value='my-secret-1'>
                    my-secret-1
                  </MenuItem>
                  <MenuItem id='my-secret-2' value='my-secret-2'>
                    my-secret-2
                  </MenuItem>
                </TextField>
              </Box>
            </Paper>
            {coderepoId && (
              <Button onClick={onDelete} variant='contained' color='primary' sx={{ float: 'right' }}>
                Delete
              </Button>
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right' }}>
              {coderepoId ? 'Edit Repo' : 'Add Repo'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
