import Section from 'components/Section'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsTextField } from '../SettingsFields'

export default function ClusterSettingsPage() {
  const form = useSettingsForm('cluster')
  return (
    <SettingsForm {...form} title='Cluster'>
      <Section title='Cluster' description='The Kubernetes cluster running App Platform.'>
        <SettingsTextField name='name' label='Name' />
        <SettingsTextField name='domainSuffix' label='Domain suffix' />
        <SettingsTextField
          name='apiServer'
          label='API server'
          helperText='URL to the Kubernetes API, used to generate the downloadable KUBECONFIG.'
        />
        <SettingsTextField name='owner' label='Owner' />
        <SettingsTextField name='provider' label='Provider' disabled />
      </Section>
    </SettingsForm>
  )
}
