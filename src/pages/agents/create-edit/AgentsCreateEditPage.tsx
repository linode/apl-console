import { Grid } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'
import { AutoResizableTextarea } from 'components/forms/TextArea'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isEqual } from 'lodash'
import {
  CreateAplAgentApiArg,
  useCreateAplAgentMutation,
  useDeleteAplAgentMutation,
  useEditAplAgentMutation,
  useGetAiModelsQuery,
  useGetAplAgentQuery,
  useGetAplKnowledgeBasesQuery,
} from 'redux/otomiApi'
import { useTranslation } from 'react-i18next'
import FormRow from 'components/forms/FormRow'
import { useAppSelector } from 'redux/hooks'
import Section from 'components/Section'
import DeleteButton from 'components/DeleteButton'
import { LoadingButton } from '@mui/lab'
import { Divider } from 'components/Divider'
import { AgentPlayground } from 'components/AgentPlayground'
import { agentSchema } from './create-edit-agents.validator'

interface Params {
  teamId: string
  agentName?: string
}

export default function AgentsCreateEditPage({
  match: {
    params: { teamId, agentName },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('')

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplAgentMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplAgentMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplAgentMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetAplAgentQuery(
    { teamId, agentName },
    { skip: !agentName },
  )
  const { data: aiModels } = useGetAiModelsQuery()
  const { data: knowledgeBases } = useGetAplKnowledgeBasesQuery({ teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  type FormType = CreateAplAgentApiArg['body']

  const defaultValues: FormType = {
    kind: 'AkamaiAgent' as const,
    metadata: {
      name: '',
    },
    spec: {
      foundationModel: '',
      agentInstructions: '',
      tools: [],
    },
  }

  const methods = useForm<FormType>({
    resolver: yupResolver(agentSchema) as unknown as Resolver<FormType>,
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
    if (data) {
      reset(data)
      const kbTool = data.spec.tools?.find((tool) => tool.type === 'knowledgeBase')
      setSelectedKnowledgeBase((kbTool?.name as string) || '')
    }
  }, [data, reset])

  const onSubmit = (formData: FormType) => {
    const body = { ...formData }

    // Transform knowledge base selection into tools array
    const tools = body.spec.tools || []
    const nonKbTools = tools.filter((tool) => tool.type !== 'knowledgeBase')

    if (selectedKnowledgeBase) {
      nonKbTools.push({
        type: 'knowledgeBase',
        name: selectedKnowledgeBase,
      })
    }

    body.spec.tools = nonKbTools

    if (agentName) update({ teamId, agentName, body })
    else create({ teamId, body })
  }

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/agents`} />

  const loading = isLoading

  if (loading) return <PaperLayout loading title={t('TITLE_AGENT')} />

  return (
    <Grid>
      <PaperLayout loading={loading || isError} title={t('TITLE_AGENT')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/agents'
          title={agentName ? `${data?.metadata.name}` : 'Create'}
          hideCrumbX={[0, 1]}
        />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section noPaddingTop>
              <FormRow spacing={10}>
                <TextField
                  label='Agent name'
                  width='large'
                  placeholder='my-agent'
                  {...register('metadata.name')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('metadata.name', value)
                  }}
                  error={!!errors.metadata?.name}
                  helperText={errors.metadata?.name?.message?.toString()}
                  disabled={!!agentName}
                />
              </FormRow>

              <Divider spacingBottom={10} />

              <FormRow spacing={10}>
                <Autocomplete
                  label='Foundation model'
                  width='large'
                  placeholder='Select a foundation model'
                  options={
                    aiModels
                      ?.filter((model) => model.spec.modelType === 'foundation')
                      .map((model) => model.metadata.name) || []
                  }
                  getOptionLabel={(option) => {
                    const model = aiModels?.find((m) => m.metadata.name === option)
                    return model?.spec.displayName || option
                  }}
                  value={watch('spec.foundationModel') || null}
                  onChange={(_, value) => {
                    setValue('spec.foundationModel', value || '')
                  }}
                  errorText={errors.spec?.foundationModel?.message?.toString()}
                  helperText={errors.spec?.foundationModel?.message?.toString()}
                />
              </FormRow>

              <Divider spacingBottom={10} />

              <FormRow spacing={10}>
                <Autocomplete
                  label='Knowledge base'
                  width='large'
                  placeholder='Select a knowledge base'
                  options={knowledgeBases?.map((kb) => kb.metadata.name) || []}
                  value={selectedKnowledgeBase}
                  onChange={(_, value) => {
                    setSelectedKnowledgeBase(value)
                  }}
                />
              </FormRow>

              <Divider spacingBottom={10} />

              <FormRow spacing={10}>
                <AutoResizableTextarea
                  label='Instructions'
                  placeholder='Enter agent instructions...'
                  minRows={12}
                  maxRows={40}
                  minWidth={400}
                  {...register('spec.agentInstructions')}
                  onChange={(e) => {
                    const value = e.target.value
                    setValue('spec.agentInstructions', value)
                  }}
                  error={!!errors.spec?.agentInstructions}
                  value={watch('spec.agentInstructions') || ''}
                />
              </FormRow>
            </Section>

            {agentName && (
              <DeleteButton
                onDelete={() => del({ teamId, agentName })}
                resourceName={watch('metadata.name')}
                resourceType='agent'
                data-cy='button-delete-agent'
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
                isLoadingCreate || isLoadingUpdate || isLoadingDelete || (agentName && data && isEqual(data, watch()))
              }
            >
              {agentName ? 'Save Changes' : 'Create Agent'}
            </LoadingButton>
          </form>
        </FormProvider>
        {agentName && <AgentPlayground teamId={teamId} agentName={agentName} />}
      </PaperLayout>
    </Grid>
  )
}
