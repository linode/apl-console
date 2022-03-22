/* eslint-disable import/prefer-default-export */
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  root: {
    width: '100%',
    marginLeft: 0,
  },
  container: {},
  header: {
    // paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerIsOf: {},
  headerSkip: {
    paddingTop: 2,
    // paddingLeft: 4,
  },
  box: {},
  grid: {},
  gridIsOf: {},
  paper: {
    padding: 16,
    marginTop: 16,
    width: '100%',
  },
}))
