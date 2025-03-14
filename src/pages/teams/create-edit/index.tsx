import { Box, Grid } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import { LandingHeader } from 'components/LandingHeader'
import { FormProvider, useForm } from 'react-hook-form'
import Section from 'components/Section'
import ControlledCheckbox from 'components/forms/ControlledCheckbox'
import { TextField } from 'components/forms/TextField'
import AdvancedSettings from 'components/AdvancedSettings'
import ImgButtonGroup from 'components/ImgButtonGroup'
import { useState } from 'react'
import TextfieldList from 'components/TextfieldList'
import { useStyles } from './create-edit-teams.styles'

type NotificationReceiver = 'slack' | 'teams' | 'opsgenie' | 'email'

export default function CreateEditTeams() {
  const { classes } = useStyles()
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
    {
      value: 'opsgenie',
      label: 'OpsGenie',
      imgSrc: '/logos/opsGenie_logo.svg',
    },
    {
      value: 'email',
      label: 'Email',
      imgSrc: '/logos/email_logo.svg',
    },
  ]

  const methods = useForm<any>({})

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

  const onSubmit = () => {
    console.log('onsubmit teams')
  }

  return (
    <Grid className={classes.root}>
      <PaperLayout>
        <LandingHeader docsLabel='Docs' title='Teams' />
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Section>
              <TextField label='Team label' width='large' noMarginTop />
            </Section>
            <AdvancedSettings>
              <Section title='Dashboards' collapsable>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='Enable dashboards'
                  control={control}
                  label='Enable dashboards'
                  explainertext='Installs Grafana for the team with pre-configured dashboards. This is required to get access to container logs.'
                />
              </Section>
              <Section title='Alerts' collapsable>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='Enable alerts'
                  control={control}
                  label='Enable alerts'
                  explainertext='Installs Alertmanager to receive alerts and optionally route them to a notification receiver.'
                />
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
                    />
                    <br />
                    <TextField
                      isHorizontalLabel
                      label='Slack channel for non-critical alerts:'
                      width='large'
                      placeholder='Channel name'
                    />
                    <TextField
                      isHorizontalLabel
                      label='Slack channel for critical alerts:'
                      width='large'
                      placeholder='Channel name'
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
                      placeholder='web hook URL'
                    />
                    <TextField
                      isHorizontalLabel
                      label='Teams web hook for critical alerts:'
                      width='large'
                      placeholder='web hook URL'
                    />
                  </>
                )}
                {activeNotificationReceiver === 'opsgenie' && (
                  <>
                    <TextField
                      isHorizontalLabel
                      label='OpsGenie Endpoint URL:'
                      width='large'
                      noMarginTop
                      placeholder='Endpoint URL'
                    />
                    <TextField isHorizontalLabel label='OpsGenie API-Key:' width='large' placeholder='API-key' />
                  </>
                )}
                {activeNotificationReceiver === 'email' && (
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                    <TextfieldList
                      title='Critrical alerts Email list:'
                      valueLabel='email list'
                      valueSize='large'
                      showLabel={false}
                      name='alerts.email.criticalemails'
                      {...register('alerts.email.criticalemails')}
                      addLabel='add email adress'
                    />
                    <TextfieldList
                      title='Non-Critrical alerts Email list:'
                      valueLabel='email list'
                      valueSize='large'
                      showLabel={false}
                      name='alerts.email.noncriticalemails'
                      {...register('alerts.email.noncriticalemails')}
                      addLabel='add email adress'
                    />
                  </Box>
                )}
              </Section>
              <Section
                title='Resource Quotas'
                collapsable
                description='A resource quota provides constraints that limit aggregate resource consumption per team. It can limit the quantity of objects that can be created in a team, as well as the total amount of compute resources that may be consumed by resources in that team.'
              >
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='Enable alerts'
                  control={control}
                  label='Enable alerts'
                  explainertext='Installs Alertmanager to receive alerts and optionally route them to a notification receiver.'
                />
              </Section>
              <Section title='Permissions' collapsable>
                <ControlledCheckbox
                  sx={{ my: 2 }}
                  name='Enable alerts'
                  control={control}
                  label='Enable alerts'
                  explainertext='Installs Alertmanager to receive alerts and optionally route them to a notification receiver.'
                />
              </Section>
            </AdvancedSettings>
          </form>
        </FormProvider>
      </PaperLayout>
    </Grid>
  )
}
