import { Box, Button, Typography } from '@mui/material'
import Section from 'components/Section'
import { useSession } from 'providers/Session'
import { useFieldArray, useFormContext } from 'react-hook-form'
import SettingsForm, { SettingsFieldset, useSettingsForm } from '../SettingsForm'
import { SettingsTextField } from '../SettingsFields'

function IngressClassFields({ name }: { name: 'platformClass' | `classes.${number}` }) {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({ control, name: `${name}.annotations` })
  return (
    <>
      <SettingsTextField name={`${name}.loadBalancerIP`} label='Load balancer IP address' />
      <SettingsTextField name={`${name}.entrypoint`} label='Entrypoint' helperText='IP address used for DNS records.' />
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsTextField name={`${name}.annotations.${index}.key`} label={`Annotation key ${index + 1}`} />
          <SettingsTextField name={`${name}.annotations.${index}.value`} label={`Annotation value ${index + 1}`} />
          <Button type='button' onClick={() => remove(index)}>
            Remove annotation {index + 1}
          </Button>
        </Box>
      ))}
      <Button type='button' onClick={() => append({ key: '', value: '' })}>
        Add annotation
      </Button>
    </>
  )
}

export default function IngressSettingsPage() {
  const form = useSettingsForm('ingress')
  const { settings } = useSession()
  const { fields, append, remove } = useFieldArray({ control: form.methods.control, name: 'classes' })
  return (
    <SettingsForm
      {...form}
      title='Ingress'
      disabled={settings.otomi.isPreInstalled}
      message={
        settings.otomi.isPreInstalled
          ? 'These settings can not be changed when installed by Akamai Connected Cloud.'
          : undefined
      }
    >
      <Section title='Platform ingress class'>
        <IngressClassFields name='platformClass' />
      </Section>
      <Section title='Additional classes'>
        {!settings.otomi.hasExternalDNS && (
          <Typography>Hint: Deploy Otomi with your DNS settings to enable this feature.</Typography>
        )}
        <SettingsFieldset disabled={!settings.otomi.hasExternalDNS}>
          {fields.map((field, index) => (
            <Box key={field.id} sx={{ mb: 3 }}>
              <SettingsTextField name={`classes.${index}.className`} label={`Class name ${index + 1}`} />
              <IngressClassFields name={`classes.${index}`} />
              <Button type='button' onClick={() => remove(index)}>
                Remove class {index + 1}
              </Button>
            </Box>
          ))}
          <Button type='button' onClick={() => append({ className: '' })}>
            Add class
          </Button>
        </SettingsFieldset>
      </Section>
    </SettingsForm>
  )
}
