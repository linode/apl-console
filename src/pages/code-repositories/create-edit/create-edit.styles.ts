import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  link: {
    fontSize: '0.725rem',
    fontWeight: 400,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&:active': {
      backgroundColor: 'transparent',
    },
  },
}))
