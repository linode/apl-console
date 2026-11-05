import { makeStyles } from 'tss-react/mui'

import type { Theme } from '@mui/material/styles'

export const useStyles = makeStyles<void, 'iconContainer'>()((theme: Theme) => ({
  forceCopyColor: {
    '&:hover, &:focus, & svg': {
      color: theme.palette.text.primary,
    },
    color: theme.palette.text.primary,
    transition: theme.transitions.create('color'),
  },
  iconContainer: {
    '& svg': {
      color: 'inherit',
      height: 12,
      width: 12,
    },
    color: 'inherit',
    display: 'inline-block',
    height: 14,
    marginLeft: -10,
    position: 'relative',
    // nifty trick to avoid the icon from wrapping by itself after the last word
    transform: 'translateX(18px)',
    width: 14,
  },
  root: {
    alignItems: 'baseline',
    color: theme.palette.cm.linkActiveLight,
    '&:hover, &:focus-visible': {
      color: theme.palette.cm.buttonPrimaryHover,
    },
  },
}))
