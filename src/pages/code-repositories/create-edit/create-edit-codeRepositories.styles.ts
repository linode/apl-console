import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()((theme) => ({
  link: {
    ...theme.typography.body2,
    fontFamily: theme.typography.fontFamily,
    fontWeight: 400,
    borderRadius: '1px',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:active': {
      backgroundColor: 'transparent',
    },
  },
}))
