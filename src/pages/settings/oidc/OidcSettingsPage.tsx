import Section from 'components/Section'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsTextField } from '../SettingsFields'

export default function OidcSettingsPage() {
  const form = useSettingsForm('oidc')
  return (
    <SettingsForm {...form} title='OIDC'>
      <Section title='Identity provider'>
        <SettingsTextField name='issuer' label='Issuer' />
        <SettingsTextField name='clientID' label='Client ID' />
        <SettingsTextField name='clientSecret' label='Client secret' type='password' />
      </Section>
      <Section title='Keycloak groups and claims'>
        <SettingsTextField name='platformAdminGroupID' label='Platform admin group ID' />
        <SettingsTextField name='allTeamsAdminGroupID' label='All teams admin group ID' />
        <SettingsTextField name='teamAdminGroupID' label='Team admin group ID' />
        <SettingsTextField
          name='usernameClaimMapper'
          label='Username claim mapper'
          helperText='Claim used by Keycloak to identify incoming users.'
        />
        <SettingsTextField
          name='subClaimMapper'
          label='Subject claim mapper'
          helperText='Claim passed by Keycloak as a unique user identifier. Keep the default unless required.'
        />
      </Section>
    </SettingsForm>
  )
}
