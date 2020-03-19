import { SnackbarProvider, useSnackbar } from 'notistack'

export const defaultOpts = {
  maxSnack: 3,
  autoHideDuration: 4000,
  preventDuplicate: true,
}

export const styles = {
  success: { backgroundColor: 'green' },
  error: { backgroundColor: 'red' },
  warning: { backgroundColor: 'orange' },
  info: { backgroundColor: 'blue' },
}

export { SnackbarProvider, useSnackbar }
