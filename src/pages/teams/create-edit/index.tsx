import { Grid } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import Section from 'components/Section'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import AdvancedSettings from 'components/AdvancedSettings'
import ImgButtonGroup from 'components/ImgButtonGroup'
import { useEffect, useState } from 'react'
import KeyValue from 'components/KeyValue'
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
import { useStyles } from './create-edit-teams.styles'
import { createTeamApiResponseSchema } from './create-edit-teams.validator'

type NotificationReceiver = 'slack' | 'teams' | 'opsgenie' | 'email'

interface Params {
  teamId?: string
}

export default function CreateEditTeams({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>) {
  const { classes } = useStyles()
  const { appsEnabled } = useSession()
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

  const mergedDefaultValues = createTeamApiResponseSchema.cast(data)

  const methods = useForm<CreateTeamApiResponse>({
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
  const controlledResourceQuotaInput = watch('resourceQuota.enabled')
  const controlledAlertmanagerInput = watch('managedMonitoring.alertmanager')

  useEffect(() => {
    if (data) reset(data)
  }, [data])

  const onSubmit = (submitData) => {
    if (teamId) update({ teamId, body: submitData })
    else create({ body: submitData })
  }

  const mutating = isLoadingCreate || isLoadingUpdate || isLoadingDelete
  if (!mutating && (isSuccessCreate || isSuccessUpdate || isSuccessDelete)) return <Redirect to='/teams' />

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader docsLabel='Docs' title='Teams' />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField
                label='Team name'
                width='large'
                noMarginTop
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Section>
            <AdvancedSettings>
              <Section title='Dashboards' collapsable>
                {!appsEnabled.grafana && (
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
                  disabled={!appsEnabled.grafana}
                  label='Enable dashboards'
                  explainertext='Installs Grafana for the team with pre-configured dashboards. This is required to get access to container logs.'
                />
              </Section>
              <Section title='Alerts' collapsable>
                {!appsEnabled.alertmanager && (
                  <InformationBanner
                    small
                    message={
                      <>
                        Alerts require Prometheus and AlertManager to be enabled. Click{' '}
                        <Link to='/apps/admin'>here</Link> to enable them.
                      </>
                    }
                  />
                )}
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='managedMonitoring.alertmanager'
                  control={control}
                  disabled={!appsEnabled.alertmanager}
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
              <Section title='Resource Quotas' collapsable>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='resourceQuota.enabled'
                  control={control}
                  label='Enable resource quotas'
                  explainertext='A resource quota provides constraints that limit aggregate resource consumption per team. It can limit the quantity of objects that can be created in a team, as well as the total amount of compute resources that may be consumed by resources in that team.'
                />
                <ControlledBox className={classes.keyValueWrapper} disabled={!controlledResourceQuotaInput}>
                  <KeyValue
                    title='Count quota'
                    keyLabel='key'
                    valueLabel='value'
                    frozen={!controlledResourceQuotaInput}
                    compressed
                    keyDisabled
                    valueDisabled
                    valueSize='medium'
                    keySize='medium'
                    showLabel={false}
                    name='resourceQuota.countQuota'
                    {...register('resourceQuota.countQuota')}
                  />
                </ControlledBox>
                <ControlledBox className={classes.keyValueWrapper} disabled={!controlledResourceQuotaInput}>
                  <KeyValue
                    title='Compute resource quota'
                    keyLabel='key'
                    valueLabel='value'
                    compressed
                    keyDisabled
                    valueSize='medium'
                    keySize='medium'
                    showLabel={false}
                    name='resourceQuota.computeResourceQuota'
                    {...register('resourceQuota.computeResourceQuota')}
                  />
                </ControlledBox>
                <ControlledBox className={classes.keyValueWrapper} disabled={!controlledResourceQuotaInput}>
                  <KeyValue
                    title='Custom resource quota'
                    keyLabel='key'
                    valueLabel='value'
                    compressed
                    valueSize='medium'
                    keySize='medium'
                    showLabel={false}
                    name='resourceQuota.customQuota'
                    addLabel='Add custom resource quota'
                    error={!!errors.resourceQuota?.customQuota}
                    errorText={errors.resourceQuota?.customQuota?.root?.message}
                    {...register('resourceQuota.customQuota')}
                  />
                </ControlledBox>
              </Section>
              <Section title='Network Policies' collapsable>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='networkPolicy.ingressPrivate'
                  control={control}
                  label='Ingress control'
                  explainertext='Keep access to pods limited within the team. Turning this off will allow any pods from any namespace to connect with the team pods, (Recommended to keep this enabled).'
                />
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='networkPolicy.egressPublic'
                  control={control}
                  label='Egress control'
                  explainertext='Keep access to public URLs limited to predefined endpoints. Turning this off allow any pods from the team to connect with any public URL (Recommended to keep this enabled).'
                />
              </Section>
              <Section title='Permissions' collapsable>
                <PermissionsTable name='selfService' />
              </Section>
            </AdvancedSettings>
            {teamId && (
              <DeleteButton
                onDelete={() => del({ teamId })}
                resourceName={watch('name')}
                resourceType='team'
                data-cy='button-delete-team'
                loading={isLoadingDelete}
              />
            )}
            <LoadingButton
              type='submit'
              variant='contained'
              color='primary'
              loading={isLoadingCreate || isLoadingUpdate}
              sx={{ float: 'right', textTransform: 'none' }}
            >
              {teamId ? 'Edit Team' : 'Create Team'}
            </LoadingButton>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
