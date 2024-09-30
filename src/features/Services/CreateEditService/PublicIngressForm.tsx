// @ts-nocheck
import React from 'react'
import { Grid } from '@mui/material'
import { TextField } from 'components/forms/TextField'
import { useFormContext } from 'react-hook-form'

function PublicIngressForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  return (
    <>
      <Grid item xs={12}>
        <TextField
          label='Subdomain'
          fullWidth
          {...register('ingress.subdomain')}
          error={!!errors.ingress?.subdomain}
          helperText={errors.ingress?.subdomain?.message}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label='Domain'
          fullWidth
          {...register('ingress.domain')}
          error={!!errors.ingress?.domain}
          helperText={errors.ingress?.domain?.message}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label='Ingress Class Name'
          fullWidth
          {...register('ingress.ingressClassName')}
          error={!!errors.ingress?.ingressClassName}
          helperText={errors.ingress?.ingressClassName?.message}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label='Certificate Name'
          fullWidth
          {...register('ingress.certName')}
          error={!!errors.ingress?.certName}
          helperText={errors.ingress?.certName?.message}
        />
      </Grid>
    </>
  )
}

export default PublicIngressForm
