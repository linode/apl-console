import Section from 'components/Section'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsTextField } from '../SettingsFields'

export default function VersionsSettingsPage() {
  const form = useSettingsForm('versions')
  return (
    <SettingsForm {...form} title='Platform version'>
      <Section title='Platform release'>
        <SettingsTextField
          name='version'
          label='Version'
          helperText='Use a valid release from the linode/apl-core GitHub repository.'
        />
      </Section>
    </SettingsForm>
  )
}
