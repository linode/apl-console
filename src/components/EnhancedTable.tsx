/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  lighten,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { useLocalStorage } from 'hooks/useLocalStorage'
import { get } from 'lodash'
import React, { ChangeEvent, MouseEvent, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (get(b, orderBy) < get(a, orderBy)) return -1

  if (get(b, orderBy) > get(a, orderBy)) return 1

  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

export interface HeadCell {
  disablePadding?: boolean
  id: string
  label: string
  numeric?: boolean
  renderer?: CallableFunction
  component?: any
}

const useEnhancedStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}))

interface EnhancedTableProps {
  classes?: any // ReturnType<typeof useEnhancedStyles>
  numSelected: number
  onRequestSort: (event: MouseEvent<unknown>, property: string) => void
  onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  rows?: any[]
  headCells: HeadCell[]
  orderByStart?: string
  disableSelect?: boolean
}

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { disableSelect, classes, order, orderBy, numSelected, rowCount, onSelectAllClick, onRequestSort, headCells } =
    props
  const createSortHandler = (property: string) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {!disableSelect && (
          <TableCell padding='checkbox' key='checkbox'>
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

const useToolbarStyles = makeStyles()((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.mode === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}))

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { classes, cx } = useToolbarStyles()
  const { numSelected } = props

  return (
    <Toolbar
      className={cx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 && (
        <Typography className={classes.title} color='inherit' variant='subtitle1' component='div'>
          {numSelected} selected
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

interface Props {
  disableSelect?: boolean
  orderByStart: string
  headCells: any[]
  rows: any[]
  idKey: string
}

// eslint-disable-next-line react/prop-types
export default function ({ disableSelect, orderByStart, headCells, rows, idKey }: Props): React.ReactElement {
  const { classes } = useEnhancedStyles()
  const [order, setOrder] = useLocalStorage('EnhancedTable:order', 'asc')
  const [orderBy, setOrderBy] = useLocalStorage('EnhancedTable:orderByStart', orderByStart)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useLocalStorage('EnhancedTable:dense', false)
  const [rowsPerPage, setRowsPerPage] = useLocalStorage('EnhancedTable:rowsPerPage', 10)

  const handleRequestSort = (event: MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: MouseEvent<unknown>, name: string) => {
    if (disableSelect) return
    const selectedIndex = selected.indexOf(name)
    let newSelected: string[] = []

    if (selectedIndex === -1) newSelected = newSelected.concat(selected, name)
    else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1))
    else if (selectedIndex === selected.length - 1) newSelected = newSelected.concat(selected.slice(0, -1))
    else if (selectedIndex > 0)
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))

    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.includes(name)

  // eslint-disable-next-line react/prop-types
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            aria-label='enhanced table'
            data-cy='table-enhanced'
          >
            <EnhancedTableHead
              disableSelect={disableSelect}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name)
                  const labelId = `enhanced-table-checkbox-${index}`

                  return (
                    <TableRow
                      hover
                      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                      onClick={(event) => handleClick(event, row.name)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={`row-${row[idKey]}`}
                      selected={isItemSelected}
                    >
                      {!disableSelect && (
                        <TableCell padding='checkbox' key='header-checkbox'>
                          <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }} />
                        </TableCell>
                      )}
                      {headCells.map((c) => (
                        <TableCell
                          key={`cell-${c.id}`}
                          align={c.numeric ? 'right' : 'left'}
                          padding={c.disablePadding ? 'none' : 'normal'}
                          sortDirection={orderBy === c.id ? order : false}
                        >
                          {c.renderer ? c.renderer(row) : row[c.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label='Dense padding' />
    </div>
  )
}
