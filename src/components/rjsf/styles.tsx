/* eslint-disable import/prefer-default-export */
import { makeStyles } from 'tss-react/mui'

export const useStyles = makeStyles()(() => ({
  root: {
    // paddingTop: 16,
    width: '100%',
    marginLeft: 0,
    // paddingRight: 16,
  },
  container: {},
  header: {
    // paddingTop: 4,
    // paddingBottom: 4,
    // paddingLeft: 8,
    // padding: 8,
    // margin: 8,
    // marginTop: 4,
  },
  headerIsOf: {
    // paddingTop: 8,
    // paddingLeft: 8,
  },
  headerSkip: {
    paddingTop: 2,
    paddingLeft: 4,
  },
  box: {
    // margin: 4,
    // padding: 4,
  },
  grid: {
    // paddingRight: 4,
    // marginBottom: 4,
    // paddingTop: 8,
    // paddingBottom: 4,
    // paddingLeft: 16,
    padding: 16,
  },
  gridIsOf: {
    paddingLeft: 8,
    paddingTop: 16,
    paddingRight: 8,
    paddingBottom: 8,
  },
  paper: {
    // marginTop: 4,
  },
}))
