import {
  OptionsObject,
  SnackbarKey,
  SnackbarProvider,
  SnackbarProviderProps,
  WithSnackbarProps,
  useSnackbar,
} from 'notistack'
import React, { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'
import Linkify from 'react-linkify'

export const defaultOpts = {
  maxSnack: 5,
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

export function NotistackProvider({ children }: SnackbarProviderProps): React.ReactElement {
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
export function SnackbarUtilsConfigurator(): React.ReactElement {
  snackbarRef = useSnackbar()
  return null
}

export default {
  success(msg: string | ReactElement, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: 'success' })
  },
  warning(msg: string | ReactElement, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: 'warning' })
  },
  info(msg: string | ReactElement, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: 'info' })
  },
  error(msg: string | ReactElement, options: OptionsObject = {}): SnackbarKey {
    return this.toast(msg, { ...options, variant: 'error' })
  },
  // eslint-disable-next-line consistent-return
  toast(msg: string | ReactElement, options: OptionsObject = {}): SnackbarKey | undefined {
    if (snackbarRef) return snackbarRef.enqueueSnackbar(msg, options)
  },
  close(id: SnackbarKey): void {
    if (snackbarRef) return snackbarRef.closeSnackbar(id)
    return undefined
  },
}

export const linkify = (msg) => (
  <Linkify
    componentDecorator={(decoratedHref, decoratedText, key) => (
      <a target='_blank' rel='noopener noreferrer' href={decoratedHref} key={key}>
        {decoratedText}
      </a>
    )}
  >
    {msg}
  </Linkify>
)
