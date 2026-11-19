import { Checkbox, FormControlLabel, FormHelperText } from '@mui/material'
import Section from 'components/Section'
import { useSession } from 'providers/Session'
import { Controller } from 'react-hook-form'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsTextField } from '../SettingsFields'

export default function AlertsSettingsPage() {
  const form = useSettingsForm('alerts')
  const { appsEnabled } = useSession()
  const receivers = form.methods.watch('receivers') ?? []
  return (
    <SettingsForm
      {...form}
      title='Alerts'
      message={!appsEnabled.alertmanager ? 'Please enable Alertmanager to activate Alerts settings' : undefined}
    >
      <Section title='Alerts' description='Configure alerting endpoints to receive notifications from Alertmanager.'>
        <SettingsTextField
          name='repeatInterval'
          label='Repeat interval'
          helperText='Waiting time before notifying again for an alert that was sent successfully.'
        />
        <SettingsTextField
          name='groupInterval'
          label='Group interval'
          helperText='Waiting time before notifying about new alerts added to a group.'
        />
        <Controller
          control={form.methods.control}
          name='receivers'
          render={({ field, fieldState }) => (
            <div>
              <FormControlLabel
                label='Slack'
                control={
                  <Checkbox
                    checked={receivers.includes('slack')}
                    onChange={(_, checked) =>
                      field.onChange(checked ? [...receivers, 'slack'] : receivers.filter((value) => value !== 'slack'))
                    }
                  />
                }
              />
              <FormControlLabel
                label='Microsoft Teams'
                control={
                  <Checkbox
                    checked={receivers.includes('msteams')}
                    onChange={(_, checked) =>
                      field.onChange(
                        checked ? [...receivers, 'msteams'] : receivers.filter((value) => value !== 'msteams'),
                      )
                    }
                  />
                }
              />
              <FormControlLabel
                label='None'
                control={
                  <Checkbox
                    checked={receivers.includes('none')}
                    onChange={(_, checked) =>
                      field.onChange(checked ? [...receivers, 'none'] : receivers.filter((value) => value !== 'none'))
                    }
                  />
                }
              />
              {fieldState.error && <FormHelperText error>{fieldState.error.message}</FormHelperText>}
            </div>
          )}
        />
      </Section>
      {receivers.includes('slack') && (
        <Section title='Slack'>
          <SettingsTextField name='slack.channel' label='Non-critical channel' />
          <SettingsTextField name='slack.channelCrit' label='Critical channel' />
          <SettingsTextField name='slack.url' label='Slack webhook URL' type='password' />
        </Section>
      )}
      {receivers.includes('msteams') && (
        <Section title='Microsoft Teams'>
          <SettingsTextField name='msteams.highPrio' label='High priority webhook' type='password' />
          <SettingsTextField name='msteams.lowPrio' label='Low priority webhook' type='password' />
        </Section>
      )}
    </SettingsForm>
  )
}
