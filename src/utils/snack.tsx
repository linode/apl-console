/* eslint-disable react/no-unstable-nested-components */
import {
  OptionsObject,
  SnackbarKey,
  SnackbarProvider,
  SnackbarProviderProps,
  WithSnackbarProps,
  useSnackbar,
} from 'notistack'
import { alpha, useTheme } from '@mui/material/styles'
import { IconifyIcon } from '@iconify/react'
import { Box, GlobalStyles } from '@mui/material'
import React, { ReactElement, useRef } from 'react'
import Linkify from 'react-linkify'
import Iconify from 'components/Iconify'
import { ColorSchema } from 'theme/palette'
import { IconButtonAnimate } from 'components/animate'
import { HEADER } from 'config'

function SnackbarStyles() {
  const theme = useTheme()
  const isLight = theme.palette.mode !== 'light'

  console.log('lighto?', isLight)

  return (
    <GlobalStyles
      styles={{
        '#root': {
          '& .SnackbarContent-root': {
            width: '100%',
            padding: theme.spacing(1),
            margin: theme.spacing(0.25, 0),
            boxShadow: theme.customShadows.z8,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 0 : 800],
            backgroundColor: theme.palette.grey[isLight ? 900 : 0],
            '& .SnackbarItem-variantSuccess, & .SnackbarItem-variantError, & .SnackbarItem-variantWarning, & .SnackbarItem-variantInfo':
              {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
            [theme.breakpoints.up('md')]: {
              minWidth: 240,
            },
          },
          '& .SnackbarItem-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .SnackbarItem-action': {
            marginRight: 0,
            color: theme.palette.action.active,
            '& svg': { width: 20, height: 20 },
          },
        },
      }}
    />
  )
}

export function NotistackProvider({ children }: SnackbarProviderProps): React.ReactElement {
  const notistackRef = useRef<any>(null)

  const onClose = (key: SnackbarKey) => () => {
    notistackRef.current.closeSnackbar(key)
  }

  return (
    <>
      <SnackbarStyles />
      <SnackbarProvider
        ref={notistackRef}
        dense
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        maxSnack={5}
        autoHideDuration={4000}
        preventDuplicate
        style={{ marginTop: HEADER.MAIN_DESKTOP_HEIGHT }}
        iconVariant={{
          info: <SnackbarIcon icon='eva:info-fill' color='info' />,
          success: <SnackbarIcon icon='eva:checkmark-circle-2-fill' color='success' />,
          warning: <SnackbarIcon icon='eva:alert-triangle-fill' color='warning' />,
          error: <SnackbarIcon icon='eva:alert-circle-fill' color='error' />,
        }}
        action={(key) => (
          <IconButtonAnimate size='small' onClick={onClose(key)} sx={{ p: 0.5 }}>
            <Iconify icon='eva:close-fill' />
          </IconButtonAnimate>
        )}
      >
        {children}
      </SnackbarProvider>
    </>
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

type SnackbarIconProps = {
  icon: IconifyIcon | string
  color: ColorSchema
}

function SnackbarIcon({ icon, color }: SnackbarIconProps) {
  return (
    <Box
      component='span'
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`,
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Iconify icon={icon} width={24} height={24} />
    </Box>
  )
}
