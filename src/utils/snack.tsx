import React from 'react'
import { useSnackbar, WithSnackbarProps, OptionsObject, SnackbarProvider, SnackbarProviderProps } from 'notistack'
import { makeStyles } from 'common/theme'

export const defaultOpts = {
  maxSnack: 3,
  autoHideDuration: 4000,
  preventDuplicate: true,
}

const useStyles = makeStyles()(({ palette }) => ({
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

export const NotistackProvider = ({ children }: SnackbarProviderProps): React.ReactElement => {
  const { classes } = useStyles()
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
export const SnackbarUtilsConfigurator = (): React.ReactElement => {
  snackbarRef = useSnackbar()
  return null
}

export default {
  success(msg: string, options: OptionsObject = {}): React.ReactElement {
    return this.toast(msg, { ...options, variant: 'success' })
  },
  warning(msg: string, options: OptionsObject = {}): React.ReactElement {
    return this.toast(msg, { ...options, variant: 'warning' })
  },
  info(msg: string, options: OptionsObject = {}): React.ReactElement {
    return this.toast(msg, { ...options, variant: 'info' })
  },
  error(msg: string, options: OptionsObject = {}): React.ReactElement {
    return this.toast(msg, { ...options, variant: 'error' })
  },
  // eslint-disable-next-line consistent-return
  toast(msg: string, options: OptionsObject = {}): React.ReactElement | any {
    if (snackbarRef) return snackbarRef.enqueueSnackbar(msg, options)
  },
  comingSoon(options: OptionsObject = {}): React.ReactElement {
    return this.toast('Coming soon!', { ...options, variant: 'warning' })
  },
  // eslint-disable-next-line consistent-return
  close(id: number): React.ReactElement | any {
    if (snackbarRef) return snackbarRef.closeSnackbar(id)
  },
}
