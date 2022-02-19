/* eslint-disable react/jsx-props-no-spreading */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useMainStyles } from 'common/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(theme => ({
  root: {
    background: theme.palette.background.paper,
  },
  body: {},
  cell: {},
  container: {},
  head: {
    backgroundColor: theme.palette.primary.light,
    textTransform: 'capitalize',
    textColor: theme.palette.common.black,
  },
  row: {},
}))

const OTable = (props): React.ReactElement => <Table {...props} className={useStyles().classes.root} />

const OTableBody = (props): React.ReactElement => <TableBody {...props} />

const OTableCell = (props): React.ReactElement => <TableCell {...props} className={useStyles().classes.cell} />

const OTableContainer = (props): React.ReactElement => (
  <TableContainer {...props} className={useStyles().classes.container} />
)

const OTableHead = (props): React.ReactElement => <TableHead {...props} className={useStyles().classes.head} />

const OTableRow = (props): React.ReactElement => {
  const { classes, cx } = useStyles()
  const { classes: mainClasses } = useMainStyles()
  return <TableRow {...props} className={cx(classes.row, mainClasses.selectable)} />
}

export {
  OTable as Table,
  OTableBody as TableBody,
  OTableCell as TableCell,
  OTableContainer as TableContainer,
  OTableHead as TableHead,
  OTableRow as TableRow,
}
