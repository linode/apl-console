import { MenuItem } from '@mui/material'
import Section from 'components/Section'
import SettingsForm, { useSettingsForm } from '../SettingsForm'
import { SettingsSelect, SettingsTextField } from '../SettingsFields'

export default function ObjectStorageSettingsPage() {
  const form = useSettingsForm('obj')
  const provider = form.methods.watch('provider')
  return (
    <SettingsForm {...form} title='Object Storage'>
      <Section title='Object Storage provider'>
        <SettingsSelect
          label='Provider'
          value={provider?.type ?? 'disabled'}
          onChange={(value) =>
            form.methods.setValue(
              'provider',
              value === 'linode'
                ? {
                    type: 'linode',
                    linode: {
                      region: '',
                      accessKeyId: '',
                      secretAccessKey: '',
                      buckets: {
                        loki: 'loki',
                        cnpg: 'cnpg',
                        harbor: 'harbor',
                        gitea: 'gitea',
                        'kubeflow-pipelines': 'kubeflow-pipelines',
                      },
                    },
                  }
                : { type: 'disabled' },
              { shouldDirty: true },
            )
          }
        >
          <MenuItem value='disabled'>Disabled</MenuItem>
          <MenuItem value='linode'>Linode</MenuItem>
        </SettingsSelect>
        {provider?.type === 'linode' && (
          <>
            <SettingsTextField name='provider.linode.region' label='Region' />
            <SettingsTextField name='provider.linode.accessKeyId' label='Access key ID' />
            <SettingsTextField name='provider.linode.secretAccessKey' label='Secret access key' type='password' />
          </>
        )}
      </Section>
      {provider?.type === 'linode' && (
        <Section title='Buckets' description='Preferred bucket names for each app.'>
          <SettingsTextField name='provider.linode.buckets.loki' label='Loki bucket' />
          <SettingsTextField name='provider.linode.buckets.cnpg' label='Database bucket' />
          <SettingsTextField name='provider.linode.buckets.harbor' label='Harbor bucket' />
          <SettingsTextField name='provider.linode.buckets.gitea' label='Gitea bucket' />
          <SettingsTextField name='provider.linode.buckets.kubeflow-pipelines' label='Kubeflow Pipelines bucket' />
        </Section>
      )}
    </SettingsForm>
  )
}
