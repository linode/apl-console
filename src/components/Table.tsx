import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
  table: {
    background: theme.palette.background.paper,
  },
  head: {
    background: theme.palette.primary.main,
    textTransform: 'capitalize',
    textColor: 'black',
  },
  row: {},
  cell: {},
}))

const MoComp = (props): any => {
  const oType = props.oType
  const Comp = props.comp
  const classes = useStyles()
  return (
    <Comp className={classes[oType]} {...props}>
      {props.children}
    </Comp>
  )
}

export const OTable = (props): any => <MoComp {...props} comp={Table} oType='table' />

export const OTableBody = (props): any => <MoComp {...props} comp={TableBody} oType='body' />

export const OTableCell = (props): any => <MoComp {...props} comp={TableCell} oType='cell' />

export const OTableContainer = (props): any => <MoComp {...props} comp={TableContainer} oType='container' />

export const OTableHead = (props): any => <MoComp {...props} comp={TableHead} oType='head' component={Paper} />

export const OTableRow = (props): any => <MoComp {...props} comp={TableRow} oType='row' />
