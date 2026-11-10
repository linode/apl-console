import { styled } from '@mui/material/styles'

import { omittedProps } from '../../utils/omittedProps'
import Plus from '../../assets/icons/plusSign'

import { Button } from './Button'

/**
 * A button for Tags. Eventually this treatment will go away,
 * but the sake of the MUI migration we need to keep it around for now, and as a styled component in order to get rid of
 * spreading excessive styles for everywhere this is used.
 *
 */
export const StyledTagButton = styled(Button, {
  label: 'StyledTagButton',
  shouldForwardProp: omittedProps(['panel']),
})<{ panel?: boolean }>(({ theme, ...props }) => ({
  ...((!props.color || props.color === 'primary') && {
    border: `1px solid ${theme.palette.cm.textBoxBorder}`,
  }),
  fontSize: '14px',
  minHeight: 30,
  whiteSpace: 'nowrap',
  ...(props.panel && {
    height: 34,
  }),
  ...(!props.disabled &&
    (!props.color || props.color === 'primary') && {
      '&:hover:not(:disabled):not([aria-disabled="true"]), &:focus-visible:not(:disabled):not([aria-disabled="true"])':
        {
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.cm.buttonPrimaryHover,
          color: theme.palette.cm.linkActiveLight,
        },
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }),
}))

export const StyledPlusIcon = styled(Plus, {
  label: 'StyledPlusIcon',
})({
  color: 'inherit',
  height: '10px',
  width: '10px',
})
