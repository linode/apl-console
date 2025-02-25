import { Button, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import {
  CreateServiceApiResponse,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useEditServiceMutation,
  useGetSecretsFromK8SQuery,
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
import { useStyles } from './create-edit.styles'
import { serviceApiResponseSchema } from './create-edit.validator'

const extractRepoName = (url: string): string => {
  const match = url.match(/\/([^/]+)\.git$/)
  return match ? match[1] : url
}

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
  const locationState = location?.state as any
  const prefilledData = locationState?.prefilled as CreateServiceApiResponse
  const { t } = useTranslation()
  const theme = useTheme()
  const { classes } = useStyles()
  const {
    settings: { cluster },
  } = useSession()
  const [secretName, setSecretName] = useState<string | undefined>(undefined)
  const [gitProvider, setGitProvider] = useState<string | null>(null)

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
    data: secrets,
    isLoading: isLoadingSecrets,
    isFetching: isFetchingSecrets,
    isError: isErrorSecrets,
    refetch: refetchSecrets,
  } = useGetSecretsFromK8SQuery({ teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

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

  // useEffect(() => {
  //   if (data) {
  //     reset(data)
  //     setGitProvider(watch('gitService'))
  //   } else setGitProvider('gitea')

  //   if (!isEmpty(prefilledData)) {
  //     reset(prefilledData)
  //     setGitProvider(prefilledData.gitService)
  //   }
  // }, [data, setValue, prefilledData])

  // useEffect(() => {
  //   const url = watch('repositoryUrl')
  //   if (url) {
  //     const githubRegex = /^(https:\/\/github\.com|git@github\.com)/
  //     const gitlabRegex = /^(https:\/\/gitlab\.com|git@gitlab\.com)/
  //     if (githubRegex.test(url)) {
  //       setValue('gitService', 'github')
  //       setGitProvider('github')
  //     } else if (gitlabRegex.test(url)) {
  //       setValue('gitService', 'gitlab')
  //       setGitProvider('gitlab')
  //     }
  //   }
  // }, [watch('repositoryUrl')])
  // serviceId = '1'

  const onSubmit = (data: CreateServiceApiResponse) => {
    // eslint-disable-next-line object-shorthand
    if (serviceId) update({ teamId, serviceId: serviceId, body: data })
    else create({ teamId, body: data })
  }
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/coderepositories`} />

  const loading = isLoading || isLoadingK8sServices
  const error = isError || isErrorK8sServices

  if (loading) return <PaperLayout loading title={t('TITLE_SERVICE')} />

  return (
    <Grid className={classes.root}>
      <PaperLayout loading={loading || error} title={t('TITLE_SERVICE')}>
        <LandingHeader docsLabel='Docs' docsLink='https://apl-docs.net/docs/get-started/overview' title='Service' />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section title='General'>
              <FormRow spacing={10}>
                <TextField label='Namespace' width='large' select>
                  <MenuItem value='namespace' disabled classes={undefined}>
                    Select a namespace
                  </MenuItem>
                </TextField>
              </FormRow>
              <FormRow spacing={10}>
                <TextField label='Service Name' width='large' select>
                  <MenuItem value='namespace' disabled classes={undefined}>
                    Select a service
                  </MenuItem>
                </TextField>
                <TextField label='Port' width='small' />
              </FormRow>
            </Section>
            <Section title='Service Exposure'>
              <FormRow spacing={10}>
                <TextField label='URL' width='large' />
                <Iconify
                  icon='eva:question-mark-circle-outline'
                  sx={{ width: '24px', height: '24px', color: '#83868B' }}
                />
              </FormRow>
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
            <Button type='submit' variant='contained' color='primary' sx={{ float: 'right', textTransform: 'none' }}>
              {serviceId ? 'Edit Service' : 'Add Service'}
            </Button>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
