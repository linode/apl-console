import { Box, Button, Grid, MenuItem } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { TextField } from 'components/forms/TextField'
import { LandingHeader } from 'components/LandingHeader'
import { Typography } from 'components/Typography'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps, useHistory } from 'react-router-dom'
import {
  CreateCoderepoApiResponse,
  useCreateCoderepoMutation,
  useDeleteCoderepoMutation,
  useEditCoderepoMutation,
  useGetCoderepoQuery,
  useGetSealedSecretsQuery,
  useGetTestRepoConnectQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import FormRow from 'components/forms/FormRow'
import { Paper } from 'components/Paper'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import ImgButtonGroup from 'components/ImgButtonGroup'
import Iconify from 'components/Iconify'
import { useAppSelector } from 'redux/hooks'
import { coderepoApiResponseSchema } from './create-edit.validator'
import { useStyles } from './create-edit.styles'

interface Params {
  teamId: string
  coderepositoryId?: string
}

export default function ({
  match: {
    params: { teamId, coderepositoryId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  // state
  const { t } = useTranslation()
  const theme = useTheme()
  const history = useHistory()
  const { classes } = useStyles()
  const [testConnectUrl, setTestConnectUrl] = useState<string | null>(null)
  const options = [
    {
      value: 'gitea',
      label: 'Gitea',
      imgSrc: '/logos/gitea_logo.svg',
    },
    {
      value: 'github',
      label: 'GitHub',
      imgSrc: '/logos/github_logo.svg',
    },
    {
      value: 'gitlab',
      label: 'GitLab',
      imgSrc: '/logos/gitlab_logo.svg',
    },
  ]

  // api calls
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateCoderepoMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditCoderepoMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteCoderepoMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetCoderepoQuery(
    { teamId, coderepoId: coderepositoryId },
    { skip: !coderepositoryId },
  )
  const {
    data: teamSecrets,
    isLoading: isLoadingTeamSecrets,
    isFetching: isFetchingTeamSecrets,
    isError: isErrorTeamSecrets,
    refetch: refetchTeamSecrets,
  } = useGetSealedSecretsQuery({ teamId }, { skip: !teamId })
  const { data: testRepoConnect } = useGetTestRepoConnectQuery({ url: testConnectUrl }, { skip: !testConnectUrl })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
    if (!isFetchingTeamSecrets) refetchTeamSecrets()
  }, [isDirty])

  // form state
  const defaultValues = {}
  const methods = useForm<CreateCoderepoApiResponse>({
    resolver: yupResolver(coderepoApiResponseSchema) as Resolver<CreateCoderepoApiResponse>,
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

  const onSubmit = (data: CreateCoderepoApiResponse) => {
    if (coderepositoryId) update({ teamId, coderepoId: coderepositoryId, body: data })
    else create({ teamId, body: data })
  }
  const onDelete = () => {
    if (coderepositoryId) del({ teamId, coderepoId: coderepositoryId })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/coderepositories`} />

  const loading = isLoading || isLoadingTeamSecrets
  const error = isError || isErrorTeamSecrets

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_CODEREPOSITORY')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://apl-docs.net/docs/get-started/overview'
          title='Code Repository'
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Paper>
              <FormRow spacing={10}>
                <TextField
                  label='Code Repository Label'
                  fullWidth
                  {...register('label')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('label', value)
                  }}
                  error={!!errors.label}
                  helperText={errors.label?.message?.toString()}
                />
              </FormRow>
            </Paper>

            <Paper>
              <Typography variant='h6'>Code Repository</Typography>
              <Typography variant='body1'>A code repository from an internal or external Git service</Typography>
              <ImgButtonGroup
                title='Git Service'
                name='gitService'
                control={control}
                options={options}
                value={watch('gitService')}
                onChange={(value) => setValue('gitService', value as 'gitea' | 'github' | 'gitlab')}
              />

              <TextField
                label='Repository URL'
                fullWidth
                {...register('repositoryUrl')}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('repositoryUrl', value)
                }}
                placeholder='Repository Url'
                error={!!errors.repositoryUrl}
                helperText={errors.repositoryUrl?.message}
                width='large'
              />

              <ControlledCheckbox
                sx={{ my: 2 }}
                name='private'
                control={control}
                label='Private'
                explainertext='Select if repository is private'
              />

              <TextField
                label='Secret'
                fullWidth
                {...(register('secret') as Pick<CreateCoderepoApiResponse, 'secret'>)}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('secret', value)
                }}
                error={!!errors.secret}
                helperText={errors.secret?.message || 'A secret that contains the authentication credentials'}
                helperTextPosition='top'
                width='large'
                value={`${watch('secret')}`}
                select
              >
                {teamSecrets ? (
                  teamSecrets?.map((secret) => (
                    <MenuItem key={secret?.id} id={secret?.id} value={secret?.name}>
                      {secret?.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value='' disabled>
                    No secrets available. Please create a new secret.
                  </MenuItem>
                )}
              </TextField>
              <Button
                variant='text'
                color='primary'
                sx={{ textTransform: 'none', fontSize: '0.625rem', fontWeight: 400 }}
                onClick={() => history.push(`/teams/${teamId}/create-sealedsecret`)}
              >
                + Create Secret
              </Button>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', mt: 2 }}>
                <Box>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={() => setTestConnectUrl(watch('repositoryUrl'))}
                    sx={{ textTransform: 'none' }}
                  >
                    Test Connection
                  </Button>
                </Box>
                {testRepoConnect?.status && testRepoConnect?.status !== 'unknown' && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '4px 12px',
                      gap: 1,
                      mt: 2,
                      border: `1px solid ${
                        testRepoConnect?.status === 'success' ? theme.palette.success.main : theme.palette.error.main
                      }`,
                      backgroundColor: `${
                        testRepoConnect?.status === 'success' ? theme.palette.success.main : theme.palette.error.main
                      }50`,
                      width: 'fit-content',
                    }}
                  >
                    <Iconify icon={testRepoConnect?.status === 'success' ? 'mdi:tick' : 'mdi:times'} />
                    <Typography
                      variant='h6'
                      sx={{
                        display: 'inline-block',
                        fontSize: 16,
                        fontWeight: 400,
                      }}
                    >
                      {testRepoConnect?.status === 'success'
                        ? 'Successfully connected with Git repository'
                        : 'Failed to connect with Git repository'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
            {coderepositoryId && (
              <Button
                onClick={onDelete}
                variant='contained'
                color='primary'
                sx={{ float: 'right', textTransform: 'none', ml: 2 }}
              >
                Delete
              </Button>
            )}
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {coderepositoryId ? 'Edit Code Repository' : 'Add Code Repository'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
