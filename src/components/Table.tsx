/* eslint-disable react/jsx-props-no-spreading */
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, makeStyles } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const useStyles = makeStyles(theme => ({
  root: {
    background: theme.palette.background.paper,
  },
  body: {},
  cell: {},
  container: {},
  head: {
    backgroundColor: theme.palette.background.default,
    textTransform: 'capitalize',
    textColor: theme.palette.common.black,
  },
  row: {},
}))

const OTable = (props): any => <Table {...props} className={useStyles().root} />

const OTableBody = (props): any => <TableBody {...props} />

const OTableCell = (props): any => <TableCell {...props} className={useStyles().cell} />

const OTableContainer = (props): any => <TableContainer {...props} className={useStyles().container} />

const OTableHead = (props): any => <TableHead {...props} className={useStyles().head} component={Paper} />

const OTableRow = (props): any => <TableRow {...props} classes={[useStyles().root, mainStyles().selectable]} />

export {
  OTable as Table,
  OTableBody as TableBody,
  OTableCell as TableCell,
  OTableContainer as TableContainer,
  OTableHead as TableHead,
  OTableRow as TableRow,
}
