import { Button } from '@mui/material'
import Section from 'components/Section'
import { useSession } from 'providers/Session'
import { useHistory } from 'react-router-dom'
import { useLocalStorage } from 'react-use'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsCheckbox, SettingsTextField } from '../SettingsFields'

function BackupFields({
  name,
  disabled,
}: {
  name: 'gitea' | 'database.harbor' | 'database.gitea' | 'database.keycloak'
  disabled?: boolean
}) {
  return (
    <>
      <SettingsCheckbox name={`${name}.enabled`} label='Enabled' disabled={disabled} />
      <SettingsTextField
        name={`${name}.retentionPolicy`}
        label='Retention policy'
        helperText='Retention in days, weeks, or months (for example: 7d).'
        disabled={disabled}
      />
      <SettingsTextField
        name={`${name}.schedule`}
        label='Schedule'
        helperText='Cron expression (for example: 0 0 * * *).'
        disabled={disabled}
      />
    </>
  )
}

export default function BackupSettingsPage() {
  const form = useSettingsForm('platformBackups')
  const { settings, appsEnabled } = useSession()
  const history = useHistory()
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const database = form.methods.watch('database')
  const gitea = form.methods.watch('gitea')
  const provider = form.data?.obj?.provider
  const storage = provider?.type === 'linode' ? provider.linode : undefined
  const configured = (bucket: 'cnpg' | 'gitea') =>
    Boolean(storage?.accessKeyId && storage?.secretAccessKey && storage?.buckets?.[bucket])
  const missingDatabase =
    settings.otomi.isPreInstalled && Object.values(database ?? {}).some((app) => app?.enabled) && !configured('cnpg')
  const missingGitea = settings.otomi.isPreInstalled && gitea?.enabled && !configured('gitea')
  let message: string | undefined
  if (missingDatabase) message = 'Database backup requires object storage to be enabled.'
  else if (missingGitea) message = 'Gitea backup requires object storage to be enabled.'
  return (
    <SettingsForm
      {...form}
      title='Backup'
      message={message}
      saveBlocked={Boolean(message)}
      action={
        message && (
          <Button
            type='button'
            onClick={() => {
              setShowObjWizard(true)
              history.push('/maintenance')
            }}
          >
            Start Object Storage Wizard
          </Button>
        )
      }
    >
      <Section title='Gitea repositories' description='Application-level backup of Gitea repositories.'>
        <BackupFields name='gitea' disabled={!appsEnabled.gitea} />
      </Section>
      <Section title='Harbor database'>
        <BackupFields name='database.harbor' disabled={!appsEnabled.harbor} />
      </Section>
      <Section title='Gitea database'>
        <BackupFields name='database.gitea' disabled={!appsEnabled.gitea} />
      </Section>
      <Section title='Keycloak database'>
        <BackupFields name='database.keycloak' />
      </Section>
    </SettingsForm>
  )
}
