import { Grid } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isEqual } from 'lodash'
import {
  CreateAplKnowledgeBaseApiArg,
  useCreateAplKnowledgeBaseMutation,
  useDeleteAplKnowledgeBaseMutation,
  useEditAplKnowledgeBaseMutation,
  useGetAiModelsQuery,
  useGetAplKnowledgeBaseQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import FormRow from 'components/forms/FormRow'
import { useAppSelector } from 'redux/hooks'
import Section from 'components/Section'
import DeleteButton from 'components/DeleteButton'
import { LoadingButton } from '@mui/lab'
import { Divider } from 'components/Divider'
import { knowledgeBaseSchema } from './create-edit-knowledgeBases.validator'

interface Params {
  teamId: string
  knowledgeBaseName?: string
}

export default function KnowledgeBasesCreateEditPage({
  match: {
    params: { teamId, knowledgeBaseName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplKnowledgeBaseMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplKnowledgeBaseMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplKnowledgeBaseMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetAplKnowledgeBaseQuery(
    { teamId, knowledgeBaseName },
    { skip: !knowledgeBaseName },
  )
  const { data: aiModels } = useGetAiModelsQuery()

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  type FormType = CreateAplKnowledgeBaseApiArg['body']

  const defaultValues: FormType = {
    kind: 'AkamaiKnowledgeBase' as const,
    metadata: {
      name: '',
    },
    spec: {
      sourceUrl: '',
      modelName: '',
    },
  }

  const methods = useForm<FormType>({
    resolver: yupResolver(knowledgeBaseSchema) as unknown as Resolver<FormType>,
    defaultValues,
  })

  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = methods

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const onSubmit = (formData: FormType) => {
    const body = { ...formData }

    if (knowledgeBaseName) update({ teamId, knowledgeBaseName, body })
    else create({ teamId, body })
  }

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/knowledge-bases`} />

  const loading = isLoading

  if (loading) return <PaperLayout loading title={t('TITLE_KNOWLEDGE_BASE')} />

  return (
    <Grid>
      <PaperLayout loading={loading || isError} title={t('TITLE_KNOWLEDGE_BASE')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/knowledge-bases'
          title={knowledgeBaseName ? `${data?.metadata.name}` : 'Create'}
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section noPaddingTop>
              <FormRow spacing={10}>
                <TextField
                  label='Knowledge base name'
                  width='large'
                  placeholder='my-knowledge-base'
                  {...register('metadata.name')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('metadata.name', value)
                  }}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!knowledgeBaseName}
                />
              </FormRow>

              <Divider spacingBottom={10} />

              <FormRow spacing={10}>
                <TextField
                  label='Data source'
                  width='large'
                  placeholder='https://example.com/vector-db.zip'
                  {...register('spec.sourceUrl')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('spec.sourceUrl', value)
                  }}
                  error={!!errors.spec?.sourceUrl}
                  helperText={errors.spec?.sourceUrl?.message?.toString()}
                  value={watch('spec.sourceUrl') || ''}
                />
              </FormRow>

              <Divider spacingBottom={10} />

              <FormRow spacing={10}>
                <Autocomplete
                  label='Embedding model'
                  width='large'
                  placeholder='Select an embedding model'
                  options={
                    aiModels
                      ?.filter((model) => model.spec.modelType === 'embedding')
                      .map((model) => model.metadata.name) || []
                  }
                  getOptionLabel={(option) => {
                    const model = aiModels?.find((m) => m.metadata.name === option)
                    return model?.spec.displayName || option
                  }}
                  value={watch('spec.modelName') || null}
                  onChange={(_, value) => {
                    setValue('spec.modelName', value || '')
                  }}
                  errorText={errors.spec?.modelName?.message?.toString()}
                  helperText={errors.spec?.modelName?.message?.toString()}
                />
              </FormRow>
            </Section>

            {knowledgeBaseName && (
              <DeleteButton
                onDelete={() => del({ teamId, knowledgeBaseName })}
                resourceName={watch('metadata.name')}
                resourceType='knowledgebase'
                data-cy='button-delete-knowledgebase'
                sx={{ float: 'right', textTransform: 'capitalize', ml: 2 }}
                loading={isLoadingDelete}
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate}
              />
            )}
            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              sx={{ float: 'right', textTransform: 'none' }}
              loading={isLoadingCreate || isLoadingUpdate}
              disabled={
                isLoadingCreate ||
                isLoadingUpdate ||
                isLoadingDelete ||
                (knowledgeBaseName && data && isEqual(data, watch()))
              }
            >
              {knowledgeBaseName ? 'Save Changes' : 'Create Knowledge Base'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
