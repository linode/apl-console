import { AppBar, Box, Grid, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { Autocomplete } from 'components/forms/Autocomplete'
import { AutoResizableTextarea } from 'components/forms/TextArea'
import { LandingHeader } from 'components/LandingHeader'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { isEmpty, isEqual } from 'lodash'
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
import TabPanel from 'components/TabPanel'
import AgentPlayground from './AgentPlayground'
import AgentResources from './AgentResources'
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

  const [tab, setTab] = useState(0)
  const handleTabChange = (event, newTab) => {
    setTab(newTab as number)
  }

  const tabHasErrors = (tabIndex: number): boolean => {
    switch (tabIndex) {
      case 0: // Settings tab
        return !!(errors.metadata?.name || errors.spec?.foundationModel)
      case 1: // Playground tab
        return !!errors.spec?.agentInstructions
      case 2: // Workflow resources tab
        return !!(errors.spec?.tools || errors.spec?.routes)
      default:
        return false
    }
  }

  const DEFAULT_AGENT_INSTRUCTIONS = 'You are a helpful assistant. Give clear answers to the users.'

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
      routes: [],
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
    trigger,
  } = methods

  useEffect(() => {
    if (data) reset(data)
  }, [data, reset])

  const onSubmit = (formData: FormType) => {
    const body = { ...formData }

    if (agentName) update({ teamId, agentName, body })
    else create({ teamId, body })
  }

  const handleFormSubmit = async () => {
    const formData = watch()
    if (isEmpty(formData.spec.agentInstructions)) {
      setValue('spec.agentInstructions', DEFAULT_AGENT_INSTRUCTIONS)
      await trigger('spec.agentInstructions')
    }
    handleSubmit(onSubmit)()
  }

  const requiredFieldsFilled = !!watch('metadata.name') && !!watch('spec.foundationModel')

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete))
    return <Redirect to={`/teams/${teamId}/agents`} />

  const loading = isLoading

  if (loading) return <PaperLayout loading title={t('TITLE_AGENT')} />

  const formButtons = (
    <Box>
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
      <Tooltip
        title={
          !agentName && !requiredFieldsFilled
            ? 'Please fill in required fields: Agent name, Foundation model, and Instructions'
            : ''
        }
      >
        <Box sx={{ float: 'right' }}>
          <LoadingButton
            onClick={handleFormSubmit}
            variant='contained'
            color='primary'
            sx={{ textTransform: 'none' }}
            loading={isLoadingCreate || isLoadingUpdate}
            disabled={
              isLoadingCreate ||
              isLoadingUpdate ||
              isLoadingDelete ||
              (!agentName && !requiredFieldsFilled) ||
              (agentName && data && isEqual(data, watch()))
            }
          >
            {agentName ? 'Save Changes' : 'Create Agent'}
          </LoadingButton>
        </Box>
      </Tooltip>
    </Box>
  )

  return (
    <Grid>
      <PaperLayout loading={loading || isError} title={t('TITLE_AGENT')}>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/agents'
          title={agentName ? `${data?.metadata.name}` : 'Create'}
          hideCrumbX={[0, 1]}
        />
        <AppBar position='relative' color='default' sx={{}}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root:not(:last-of-type)': {
                marginRight: 0,
              },
            }}
          >
            <Tab
              label='Settings'
              value={0}
              sx={{
                textTransform: 'capitalize',
                padding: '12px 16px',
                ...(tab !== 0 &&
                  tabHasErrors(0) && {
                    borderBottom: '2px solid',
                    borderBottomColor: 'error.main',
                  }),
              }}
            />
            <Tab
              label='Playground'
              value={1}
              sx={{
                textTransform: 'capitalize',
                padding: '12px 16px',
                ...(tab !== 1 &&
                  tabHasErrors(1) && {
                    borderBottom: '2px solid',
                    borderBottomColor: 'error.main',
                  }),
              }}
            />
            <Tab
              label='Workflow resources'
              value={2}
              sx={{
                textTransform: 'capitalize',
                padding: '12px 16px',
                ...(tab !== 2 &&
                  tabHasErrors(2) && {
                    borderBottom: '2px solid',
                    borderBottomColor: 'error.main',
                  }),
              }}
            />
          </Tabs>
        </AppBar>
        <FormProvider {...methods}>
          <form>
            <TabPanel value={tab} index={0}>
              <Section noPaddingTop>
                <FormRow spacing={10}>
                  <TextField
                    label='Agent name *'
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
                    label='Foundation model *'
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
              </Section>

              {formButtons}
            </TabPanel>

            <TabPanel value={tab} index={1}>
              <Section noPaddingTop>
                <FormRow spacing={10}>
                  <AutoResizableTextarea
                    label='Instructions *'
                    placeholder={`Enter agent instructions... (Leave empty to use the default: '${DEFAULT_AGENT_INSTRUCTIONS}')`}
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

              <Box sx={{ my: 2 }}>{formButtons}</Box>

              {agentName ? (
                <Box sx={{ clear: 'both' }}>
                  <AgentPlayground teamId={teamId} agentName={agentName} />
                </Box>
              ) : (
                <Box
                  sx={{
                    clear: 'both',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '200px',
                    backgroundColor: 'background.paper',
                    mt: 10,
                  }}
                >
                  <Typography variant='body1' color='text.secondary'>
                    Playground will be available here after creating the agent.
                  </Typography>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={tab} index={2}>
              <Section noPaddingTop>
                <FormRow spacing={10}>
                  <Autocomplete<string, true>
                    label='Knowledge base(s)'
                    width='large'
                    placeholder='Select knowledge base(s)'
                    options={knowledgeBases?.map((kb) => kb.metadata.name) || []}
                    multiple
                    limitTags={-1}
                    compactMultiSelect
                    value={
                      watch('spec.tools')
                        ?.filter((tool) => tool.type === 'knowledgeBase')
                        .map((tool) => tool.name) || []
                    }
                    onChange={(_, value) => {
                      const currentTools = watch('spec.tools') || []
                      const nonKbTools = currentTools.filter((tool) => tool.type !== 'knowledgeBase')
                      const kbTools = (value as string[]).map((name) => ({ type: 'knowledgeBase' as const, name }))
                      const updatedTools = [...nonKbTools, ...kbTools]
                      setValue('spec.tools', updatedTools)
                    }}
                  />
                </FormRow>
                <Divider spacingBottom={10} />
                <AgentResources
                  title='Agent route(s)'
                  name='spec.routes'
                  mode='route'
                  showLabel
                  compressed
                  addLabel='add agent route'
                />
                <Divider spacingBottom={10} />
                <AgentResources
                  title='MCP server(s)'
                  name='spec.tools'
                  mode='tool'
                  toolType='mcpServer'
                  showLabel
                  compressed
                  addLabel='add MCP server'
                  filterFn={(tool) => tool.type === 'mcpServer'}
                />
                <Divider spacingBottom={10} />
                <AgentResources
                  title='Subworkflow(s)'
                  name='spec.tools'
                  mode='tool'
                  toolType='subWorkflow'
                  showLabel
                  compressed
                  addLabel='add subworkflow'
                  filterFn={(tool) => tool.type === 'subWorkflow'}
                />
                <Divider spacingBottom={10} />
                <AgentResources
                  title='Function route(s)'
                  name='spec.tools'
                  mode='tool'
                  toolType='function'
                  showLabel
                  compressed
                  addLabel='add function route'
                  filterFn={(tool) => tool.type === 'function'}
                />
              </Section>

              {formButtons}
            </TabPanel>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
