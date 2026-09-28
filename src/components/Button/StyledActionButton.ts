import { styled } from '@mui/material/styles'
import { Button } from './Button'

/**
 * A button for our action menu's. Eventually this treatment will go away,
 * but the sake of the MUI migration we need to keep it around for now, and as a styled component in order to get rid of
 * spreading excessive styles for everywhere this is used.
 *
 */
export const StyledActionButton = styled(Button, {
  label: 'StyledActionButton',
})(({ theme, ...props }) => ({
  ...(!props.disabled &&
    (!props.color || props.color === 'primary') && {
      '&:hover:not(:disabled):not([aria-disabled="true"])': {
        backgroundColor: theme.palette.cm.buttonPrimaryHover,
        borderColor: theme.palette.cm.buttonPrimaryHover,
        color: theme.palette.primary.contrastText,
      },
    }),
  ...((!props.color || props.color === 'primary') && {
    background: 'transparent',
    borderColor: 'transparent',
    color: theme.palette.cm.linkActiveLight,
  }),
  fontFamily: theme.font.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  minWidth: 0,
  padding: '12px 10px',
  ...(props.disabled && {
    color: theme.palette.action.disabled,
    cursor: 'default',
  }),
}))
