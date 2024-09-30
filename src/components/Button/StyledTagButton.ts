import { styled } from '@mui/material/styles'

import { omittedProps } from '../../utils/omittedProps'
import Plus from '../../assets/icons/plusSign.svg'

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
  border: 'none',
  fontSize: '0.875rem',
  minHeight: 30,
  whiteSpace: 'nowrap',
  ...(props.panel && {
    height: 34,
  }),
  ...(!props.disabled && {
    '&:hover, &:focus': {
      backgroundColor: theme.palette.cm.tagButtonBg,
      border: 'none',
      color: theme.palette.cm.tagButtonText,
    },
    backgroundColor: theme.palette.cm.tagButtonBg,
    color: theme.palette.cm.tagButtonText,
  }),
}))

export const StyledPlusIcon = styled(Plus, {
  label: 'StyledPlusIcon',
})(({ theme, ...props }) => ({
  color: props.disabled
    ? theme.palette.mode === 'dark'
      ? '#5c6470'
      : theme.palette.cm.disabledText
    : theme.palette.cm.tagIcon,
  height: '10px',
  width: '10px',
}))
