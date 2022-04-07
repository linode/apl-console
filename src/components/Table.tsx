/* eslint-disable react/jsx-props-no-spreading */
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import { useMainStyles } from 'common/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
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

function OTable(props): React.ReactElement {
  return <Table {...props} className={useStyles().classes.root} />
}

function OTableBody(props): React.ReactElement {
  return <TableBody {...props} />
}

function OTableCell(props): React.ReactElement {
  return <TableCell {...props} className={useStyles().classes.cell} />
}

function OTableContainer(props): React.ReactElement {
  return <TableContainer {...props} className={useStyles().classes.container} />
}

function OTableHead(props): React.ReactElement {
  return <TableHead {...props} className={useStyles().classes.head} />
}

function OTableRow(props): React.ReactElement {
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
