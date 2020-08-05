import React from 'react'
import { useSnackbar, WithSnackbarProps, OptionsObject, SnackbarProvider, SnackbarProviderProps } from 'notistack'
import { makeStyles } from '@material-ui/core'

export const defaultOpts = {
  maxSnack: 3,
  autoHideDuration: 4000,
  preventDuplicate: true,
}

const useStyles = makeStyles(({ palette }) => ({
  variantSuccess: {
    backgroundColor: palette.success.main,
  },
  variantError: {
    backgroundColor: palette.error.main,
  },
  variantInfo: {
    backgroundColor: palette.info.main,
  },
  variantWarning: {
    backgroundColor: palette.warning.main,
  },
}))

export const NotistackProvider = ({ children }: SnackbarProviderProps) => {
  const classes = useStyles()
  return (
    <SnackbarProvider
      classes={classes}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      {...defaultOpts}
    >
      {children}
    </SnackbarProvider>
  )
}

let snackbarRef: WithSnackbarProps
export const SnackbarUtilsConfigurator = () => {
  snackbarRef = useSnackbar()
  return null
}

export default {
  success(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: 'success' })
  },
  warning(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: 'warning' })
  },
  info(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: 'info' })
  },
  error(msg: string, options: OptionsObject = {}) {
    this.toast(msg, { ...options, variant: 'error' })
  },
  toast(msg: string, options: OptionsObject = {}) {
    if (snackbarRef) snackbarRef.enqueueSnackbar(msg, options)
  },
}
