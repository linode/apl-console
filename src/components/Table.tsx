import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const useStyles = makeStyles(theme => ({
  table: {
    background: theme.palette.background.paper,
  },
  head: {
    backgroundColor: theme.palette.background.default,
    textTransform: 'capitalize',
    textColor: theme.palette.common.black,
  },
  row: {},
  cell: {},
}))

const MoComp = (props): any => {
  const oType = props.oType
  const Comp = props.comp
  const classNames = props.classNames || []
  const classes = useStyles()
  const mainClasses = mainStyles()
  return (
    <Comp className={`${classes[oType]} ${classNames.map(cls => mainClasses[cls]).join(' ')}`} {...props}>
      {props.children}
    </Comp>
  )
}

export const OTable = (props): any => <MoComp {...props} comp={Table} oType='table' />

export const OTableBody = (props): any => <MoComp {...props} comp={TableBody} oType='body' />

export const OTableCell = (props): any => <MoComp {...props} comp={TableCell} oType='cell' />

export const OTableContainer = (props): any => <MoComp {...props} comp={TableContainer} oType='container' />

export const OTableHead = (props): any => <MoComp {...props} comp={TableHead} oType='head' component={Paper} />

export const OTableRow = (props): any => <MoComp {...props} comp={TableRow} oType='row' classNames={['selectable']} />
