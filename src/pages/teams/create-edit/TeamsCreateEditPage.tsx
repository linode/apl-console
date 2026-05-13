import { Grid } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { FormProvider, Resolver, get, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import AdvancedSettings from 'components/AdvancedSettings'
import ImgButtonGroup from 'components/ImgButtonGroup'
import { useEffect, useState } from 'react'
import {
  CreateAplTeamApiArg,
  CreateAplTeamApiResponse,
  useCreateAplTeamMutation,
  useDeleteAplTeamMutation,
  useEditAplTeamMutation,
  useGetAplTeamQuery,
} from 'redux/otomiApi'
import { yupResolver } from '@hookform/resolvers/yup'
import { PermissionsTable } from 'components/PermissionTable'
import ControlledBox from 'components/ControlledBox'
import { useSession } from 'providers/Session'
import InformationBanner from 'components/InformationBanner'
import { Link } from 'components/LinkUrl/LinkUrl'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteButton from 'components/DeleteButton'
import useSettings from 'hooks/useSettings'
import { useStyles } from './create-edit-teams.styles'
import { createAplTeamApiSchema } from './create-edit-teams.validator'
import ResourceQuotaKeyValue from './TeamsResourceQuotaKeyValue'

type NotificationReceiver = 'slack' | 'teams' | 'opsgenie' | 'email'

interface Params {
  teamId?: string
}

export default function TeamsCreateEditPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) {
  const { classes } = useStyles()
  const { appsEnabled, user, settings } = useSession()
  const { themeView } = useSettings()
  const { isPlatformAdmin, isTeamAdmin } = user

  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateAplTeamMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditAplTeamMutation()

  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteAplTeamMutation()
  const { data } = useGetAplTeamQuery({ teamId }, { skip: !teamId })

  const [activeNotificationReceiver, setActiveNotificationReceiver] = useState<NotificationReceiver>('slack')
  const notificationReceiverOptions = [
    { value: 'slack', label: 'Slack', imgSrc: '/logos/slack_logo.svg' },
    { value: 'teams', label: 'Teams', imgSrc: '/logos/teams_logo.svg' },
  ]

  const tier = settings?.cluster?.linode?.tier || 'standard'
  const isAdmin = isPlatformAdmin || isTeamAdmin

  const mergedDefaultValues = createAplTeamApiSchema.cast({
    kind: 'AplTeamSettingSet',
    metadata: {
      name: '',
      labels: teamId ? ({ 'apl.io/teamId': teamId } as any) : ({} as any),
      ...(data?.metadata ?? {}),
    },
    spec: {
      ...(data?.spec ?? {}),
      ...(!teamId && {
        networkPolicy: {
          ...(data?.spec?.networkPolicy ?? {}),
          ingressPrivate: true,
          egressPublic: tier !== 'enterprise',
        },
      }),
    },
    status: data?.status ?? { conditions: [], phase: undefined },
  }) as CreateAplTeamApiResponse

  const methods = useForm<CreateAplTeamApiResponse>({
    disabled: !isAdmin,
    resolver: yupResolver(createAplTeamApiSchema) as Resolver<CreateAplTeamApiResponse>,
    defaultValues: mergedDefaultValues,
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

  const controlledAlertmanagerInput = watch('spec.managedMonitoring.alertmanager')

  useEffect(() => {
    if (!data) return

    /**
     * strip off trailing “Gi” for memory quotas so the <ResourceQuotaKeyValue>
     * number fields render just “32” instead of “32Gi”
     */
    const strippedDecorators = (data.spec?.resourceQuota ?? []).map(({ name, value }) => {
      if (name?.endsWith('.memory') && typeof value === 'string' && value.endsWith('Gi'))
        return { name, value: value.slice(0, -2) }
      return { name, value }
    })

    reset({
      ...data,
      spec: {
        ...(data.spec ?? {}),
        resourceQuota: strippedDecorators,
      },
    })

    const teamsWebhookLow = get(data, 'spec.alerts.msteams.lowPrio')
    const teamsWebhookHigh = get(data, 'spec.alerts.msteams.highPrio')
    setActiveNotificationReceiver(teamsWebhookLow || teamsWebhookHigh ? 'teams' : 'slack')
  }, [data, reset])

  const onSubmit = (submitData: CreateAplTeamApiResponse) => {
    // 1) Re-attach “Gi” to any memory quotas
    const resourceQuota =
      submitData.spec?.resourceQuota?.map(({ name, value }) => {
        if (name.endsWith('.memory') && value != null) return { name, value: `${value}Gi` }
        return { name, value }
      }) ?? []

    /**
     * 2) alerts.receivers has very weird behaviour in the core.
     * It expects either an alert receiver like slack OR it expects string 'none' because
     * alertManager needs to be configured with 'receivers: null' if there are no recievers and 'none' is currently
     * the way to configure that.
     */
    const rawReceivers = submitData.spec?.alerts?.receivers ?? []
    let receivers = rawReceivers.filter((r) => r !== 'none')

    // @ts-ignore: no receivers requires 'none' string
    if (submitData.spec?.managedMonitoring?.alertmanager && receivers.length === 0) receivers = ['none']

    // 3) Combine edge cases with submittedData for final payload
    const body: CreateAplTeamApiArg['body'] = {
      kind: 'AplTeamSettingSet',
      metadata: {
        name: submitData.metadata?.name ?? '',
        labels: {
          'apl.io/teamId': submitData.metadata?.name,
        },
      },
      spec: {
        ...(submitData.spec ?? {}),
        resourceQuota,
        alerts: {
          ...(submitData.spec?.alerts ?? {}),
          receivers,
        },
      },
    }

    // 4) Send it off
    if (teamId) update({ teamId, body })
    else create({ body })
  }

  const isPlatformView = themeView === 'platform'
  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete) && isPlatformView)
    return <Redirect to='/teams' />

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader
          docsLabel='Docs'
          docsLink='https://techdocs.akamai.com/app-platform/docs/platform-teams'
          title={themeView === 'team' ? `${teamId} Settings` : teamId || 'Create'}
          // hides the first crumb for the teamSettings page (e.g. /teams)
          hideCrumbX={themeView === 'team' ? [0] : []}
        />

        {!isAdmin && <InformationBanner message='This page is readonly' sx={{ mb: 3 }} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField
                label='Team name'
                width='large'
                noMarginTop
                value={watch('metadata.name') ?? ''}
                onChange={(e) => setValue('metadata.name', e.target.value)}
                error={!!errors.metadata?.name}
                helperText={errors.metadata?.name?.message?.toString()}
                disabled={!!teamId}
              />
            </Section>

            <AdvancedSettings>
              <Section title='Dashboards' collapsable noMarginTop={appsEnabled.grafana || !isAdmin}>
                {!appsEnabled.grafana && isAdmin && (
                  <InformationBanner
                    small
                    message={
                      <>
                        Dashboards require Grafana to be enabled. Click <Link to='/apps/admin'>here</Link> to enable it.
                      </>
                    }
                  />
                )}
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.managedMonitoring.grafana'
                  control={control}
                  disabled={!appsEnabled.grafana || !isAdmin}
                  label='Enable dashboards'
                  explainertext='Installs Grafana for the team with pre-configured dashboards. This is required to get access to container logs.'
                />
              </Section>

              <Section title='Alerts' collapsable noMarginTop={appsEnabled.prometheus || !isAdmin}>
                {!appsEnabled.prometheus && isAdmin && (
                  <InformationBanner
                    small
                    message={
                      <>
                        Alerts requires Prometheus to be enabled. Click <Link to='/apps/admin'>here</Link> to enable
                        Prometheus.
                      </>
                    }
                  />
                )}
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.managedMonitoring.alertmanager'
                  control={control}
                  disabled={!appsEnabled.prometheus || !isAdmin}
                  label='Enable alerts'
                  explainertext='Installs Alertmanager to receive alerts and optionally route them to a notification receiver.'
                />

                <ControlledBox sx={{ mt: 3 }} disabled={!controlledAlertmanagerInput}>
                  <ImgButtonGroup
                    title='Notification Receivers'
                    description='Optionally configure notification receivers.'
                    name='notificationReceivers'
                    control={control}
                    options={notificationReceiverOptions}
                    value={activeNotificationReceiver}
                    onChange={(value) => setActiveNotificationReceiver(value as NotificationReceiver)}
                  />

                  {activeNotificationReceiver === 'slack' && (
                    <>
                      <TextField
                        isHorizontalLabel
                        label='Slack Endpoint URL:'
                        width='large'
                        noMarginTop
                        placeholder='Endpoint URL'
                        {...register('spec.alerts.slack.url')}
                      />
                      <br />
                      <TextField
                        isHorizontalLabel
                        label='Slack channel for non-critical alerts:'
                        width='large'
                        placeholder='Channel name'
                        {...register('spec.alerts.slack.channel')}
                      />
                      <TextField
                        isHorizontalLabel
                        label='Slack channel for critical alerts:'
                        width='large'
                        placeholder='Channel name'
                        {...register('spec.alerts.slack.channelCrit')}
                      />
                    </>
                  )}

                  {activeNotificationReceiver === 'teams' && (
                    <>
                      <TextField
                        isHorizontalLabel
                        label='Teams webhook for non-critical alerts:'
                        width='large'
                        noMarginTop
                        placeholder='Webhook URL'
                        {...register('spec.alerts.msteams.lowPrio')}
                      />
                      <TextField
                        isHorizontalLabel
                        label='Teams webhook for critical alerts:'
                        width='large'
                        placeholder='Webhook URL'
                        {...register('spec.alerts.msteams.highPrio')}
                      />
                    </>
                  )}
                </ControlledBox>
              </Section>

              <Section
                title='Resource Quotas'
                collapsable
                description='A resource quota provides constraints that limit aggregated resource consumption per team. It can limit the quantity of objects that can be created in a team, as well as the total amount of compute resources that may be consumed by resources in that team.'
              >
                <ResourceQuotaKeyValue name='spec.resourceQuota' disabled={!isAdmin} />
              </Section>

              <Section title='Network Policies' collapsable noMarginTop>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.networkPolicy.ingressPrivate'
                  control={control}
                  label='Ingress control'
                  explainertext='Control Pod network access. Turning this off allows any Pod from any namespace to connect to any Pod from the team. (Recommended to keep this enabled)'
                />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='spec.networkPolicy.egressPublic'
                  control={control}
                  label='Egress control'
                  explainertext='Control Pod access to public URLs. Turning this off allows any Pod from the team to connect to any public URL.(Recommended to keep this enabled)'
                />
              </Section>

              <Section title='Permissions' collapsable>
                <PermissionsTable name='spec.selfService' disabled={!isAdmin} />
              </Section>
            </AdvancedSettings>

            {teamId && (
              <DeleteButton
                onDelete={() => del({ teamId })}
                resourceName={watch('metadata.name') ?? ''}
                resourceType='team'
                data-cy='button-delete-team'
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate || !isAdmin}
                loading={isLoadingDelete}
              />
            )}

            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              loading={isLoadingCreate || isLoadingUpdate}
              disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || !isAdmin}
              sx={{ float: 'right', textTransform: 'none' }}
            >
              {teamId ? 'Save Changes' : 'Create Team'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
