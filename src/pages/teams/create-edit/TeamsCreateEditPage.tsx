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
  CreateTeamApiResponse,
  useCreateTeamMutation,
  useDeleteTeamMutation,
  useEditTeamMutation,
  useGetTeamQuery,
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
import { createTeamApiResponseSchema } from './create-edit-teams.validator'
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
  const { isPlatformAdmin } = user
  const [create, { isLoading: isLoadingCreate, isSuccess: isSuccessCreate }] = useCreateTeamMutation()
  const [update, { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate }] = useEditTeamMutation()
  const [del, { isLoading: isLoadingDelete, isSuccess: isSuccessDelete }] = useDeleteTeamMutation()
  const { data, isLoading, isFetching, isError, refetch } = useGetTeamQuery({ teamId }, { skip: !teamId })
  const [activeNotificationReceiver, setActiveNotificationReceiver] = useState<NotificationReceiver>('slack')
  const notificationReceiverOptions = [
    {
      value: 'slack',
      label: 'Slack',
      imgSrc: '/logos/slack_logo.svg',
    },
    {
      value: 'teams',
      label: 'Teams',
      imgSrc: '/logos/teams_logo.svg',
    },
    // {
    //   value: 'email',
    //   label: 'Email',
    //   imgSrc: '/logos/email_logo.svg',
    // },
  ]
  const tier = settings?.cluster?.linode?.tier || 'standard'

  const mergedDefaultValues = createTeamApiResponseSchema.cast({
    ...data,
    ...(!teamId && {
      networkPolicy: {
        ...data?.networkPolicy,
        ingressPrivate: true,
        egressPublic: tier !== 'enterprise',
      },
    }),
  })

  const methods = useForm<CreateTeamApiResponse>({
    disabled: !isPlatformAdmin,
    resolver: yupResolver(createTeamApiResponseSchema) as Resolver<CreateTeamApiResponse>,
    defaultValues: mergedDefaultValues,
  })

  const {
    control,
    register,
    reset,
    resetField,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
    trigger,
  } = methods

  // checkbox logic
  // const controlledResourceQuotaInput = watch('resourceQuota.enabled')
  const controlledAlertmanagerInput = watch('managedMonitoring.alertmanager')

  useEffect(() => {
    if (!data) return

    /**
     * strip off trailing “Gi” for memory quotas so the <ResourceQuotaKeyValue>
     * number fields render just “32” instead of “32Gi”
     */
    const strippedDecorators = (data.resourceQuota ?? []).map(({ name, value }) => {
      if (name.endsWith('.memory') && typeof value === 'string' && value.endsWith('Gi'))
        return { name, value: value.slice(0, -2) } // drop the “Gi”

      return { name, value }
    })
    reset({
      ...data,
      resourceQuota: strippedDecorators,
    })

    const teamsWebhookLow = get(data, 'alerts.msteams.lowPrio')
    const teamsWebhookHigh = get(data, 'alerts.msteams.highPrio')

    if (teamsWebhookLow || teamsWebhookHigh) setActiveNotificationReceiver('teams')
    else setActiveNotificationReceiver('slack')
  }, [data])

  const onSubmit = (submitData: CreateTeamApiResponse) => {
    // 1) Re‐attach “Gi” to any memory quotas
    const resourceQuota = submitData.resourceQuota.map(({ name, value }) => {
      if (name.endsWith('.memory') && value != null) return { name, value: `${value}Gi` }

      return { name, value }
    })

    /**
     * 2) alerts.receivers has very weird behaviour in the core.
     * It expects either an alert receiver like slack OR it expects string 'none' because
     * alertManager needs to be configured with 'receivers: null' if there are no recievers and 'none' is currently
     * the way to configure that.
     */
    const rawReceivers = submitData.alerts?.receivers ?? []
    let receivers = rawReceivers.filter((r) => r !== 'none')

    // @ts-ignore: no receivers requires 'none' string
    if (submitData.managedMonitoring?.alertmanager && receivers.length === 0) receivers = ['none']

    // 3) Combine edge cases with submittedData for final payload
    const payload: CreateTeamApiResponse = {
      ...submitData,
      resourceQuota,
      alerts: {
        ...submitData.alerts,
        receivers,
      },
    }

    // 4) Send it off
    if (teamId) update({ teamId, body: payload })
    else create({ body: payload })
  }

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/teams' />

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
        {!isPlatformAdmin && <InformationBanner message='This page is readonly' sx={{ mb: 3 }} />}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField
                label='Team name'
                width='large'
                noMarginTop
                value={watch('name')}
                onChange={(e) => {
                  const value = e.target.value
                  setValue('name', value)
                }}
                error={!!errors.name}
                helperText={errors.name?.message?.toString()}
                disabled={!!teamId}
              />
            </Section>
            <AdvancedSettings>
              <Section title='Dashboards' collapsable noMarginTop={appsEnabled.grafana || !isPlatformAdmin}>
                {!appsEnabled.grafana && isPlatformAdmin && (
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
                  name='managedMonitoring.grafana'
                  control={control}
                  disabled={!appsEnabled.grafana || !isPlatformAdmin}
                  label='Enable dashboards'
                  explainertext='Installs Grafana for the team with pre-configured dashboards. This is required to get access to container logs.'
                />
              </Section>
              <Section title='Alerts' collapsable noMarginTop={appsEnabled.prometheus || !isPlatformAdmin}>
                {!appsEnabled.prometheus && isPlatformAdmin && (
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
                  name='managedMonitoring.alertmanager'
                  control={control}
                  disabled={!appsEnabled.prometheus || !isPlatformAdmin}
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
                    onChange={(value) => {
                      setActiveNotificationReceiver(value as NotificationReceiver)
                    }}
                  />
                  {activeNotificationReceiver === 'slack' && (
                    <>
                      <TextField
                        isHorizontalLabel
                        label='Slack Endpoint URL:'
                        width='large'
                        noMarginTop
                        placeholder='Endpoint URL'
                        {...register('alerts.slack.url')}
                      />
                      <br />
                      <TextField
                        isHorizontalLabel
                        label='Slack channel for non-critical alerts:'
                        width='large'
                        placeholder='Channel name'
                        {...register('alerts.slack.channel')}
                      />
                      <TextField
                        isHorizontalLabel
                        label='Slack channel for critical alerts:'
                        width='large'
                        placeholder='Channel name'
                        {...register('alerts.slack.channelCrit')}
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
                        {...register('alerts.msteams.lowPrio')}
                      />
                      <TextField
                        isHorizontalLabel
                        label='Teams webhook for critical alerts:'
                        width='large'
                        placeholder='Webhook URL'
                        {...register('alerts.msteams.highPrio')}
                      />
                    </>
                  )}
                  {/* NOTE: keep this code in case email notification receiver will be re-enabled

                {activeNotificationReceiver === 'email' && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                    <TextfieldList
                      title='Critrical alerts Email list:'
                      valueLabel='email list'
                      valueSize='large'
                      showLabel={false}
                      name='alerts.email.criticalemails'
                      {...register('alerts.email.critical')}
                      addLabel='add email adress'
                    />
                    <TextfieldList
                      title='Non-Critrical alerts Email list:'
                      valueLabel='email list'
                      valueSize='large'
                      showLabel={false}
                      name='alerts.email.noncriticalemails'
                      {...register('alerts.email.nonCritical')}
                      addLabel='add email adress'
                    />
                  </Box>
                )} */}
                </ControlledBox>
              </Section>
              <Section
                title='Resource Quotas'
                collapsable
                description='A resource quota provides constraints that limit aggregated resource consumption per team. It can limit the quantity of objects that can be created in a team, as well as the total amount of compute resources that may be consumed by resources in that team.'
              >
                <ResourceQuotaKeyValue name='resourceQuota' disabled={!isPlatformAdmin} />
              </Section>
              <Section title='Network Policies' collapsable noMarginTop>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='networkPolicy.ingressPrivate'
                  control={control}
                  label='Ingress control'
                  explainertext='Control Pod network access. Turning this off allows any Pod from any namespace to connect to any Pod from the team. (Recommended to keep this enabled)'
                />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='networkPolicy.egressPublic'
                  control={control}
                  label='Egress control'
                  explainertext='Control Pod access to public URLs. Turning this off allows any Pod from the team to connect to any public URL.(Recommended to keep this enabled)'
                />
              </Section>
              <Section title='Permissions' collapsable>
                <PermissionsTable name='selfService' disabled={!isPlatformAdmin} />
              </Section>
            </AdvancedSettings>
            {teamId && (
              <DeleteButton
                onDelete={() => del({ teamId })}
                resourceName={watch('name')}
                resourceType='team'
                data-cy='button-delete-team'
                disabled={isLoadingDelete || isLoadingCreate || isLoadingUpdate || !isPlatformAdmin}
                loading={isLoadingDelete}
              />
            )}
            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              loading={isLoadingCreate || isLoadingUpdate}
              disabled={isLoadingCreate || isLoadingUpdate || isLoadingDelete || !isPlatformAdmin}
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
