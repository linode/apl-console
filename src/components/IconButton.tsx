import MuiIconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'

export type { IconButtonProps } from '@mui/material/IconButton'

export const IconButton = styled(MuiIconButton)(({ theme, color }) => ({
  borderRadius: 0,
  boxShadow: 'none',
  fontFamily: theme.font?.normal ?? theme.typography.fontFamily,
  ...((!color || color === 'default' || color === 'primary') && {
    color: theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main,
    '&:hover:not(.Mui-disabled)': {
      color: theme.palette.cm?.buttonPrimaryHover ?? theme.palette.primary.dark,
    },
  }),
  '&.Mui-focusVisible': {
    outline: `2px solid ${theme.palette.cm?.linkActiveLight ?? theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  '&.Mui-disabled': {
    color: theme.palette.action.disabled,
  },
})) as unknown as typeof MuiIconButton
