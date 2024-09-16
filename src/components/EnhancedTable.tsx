/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  styled,
} from '@mui/material'
import { sentenceCase } from 'utils/data'
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

// ---------------- styles ----------------------

const StyledTableHeaderCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.contrastAlt,
  color: 'rgb(136, 143, 145)',
  fontFamily: 'LatoWebBold, sans-serif',
  padding: '10px 15px',
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
}))

// --------------------------------------------

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

interface EnhancedTableHeadProps {
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

export function EnhancedTableHead(props: EnhancedTableHeadProps) {
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
              inputProps={{ 'aria-label': 'select all' }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <StyledTableHeaderCell
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
              {sentenceCase(headCell.label)}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </StyledTableHeaderCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

export interface EnhancedTableProps {
  disableSelect?: boolean
  orderByStart?: string
  headCells: any[]
  rows: Record<string, any>[]
  idKey?: string | CallableFunction
}

// eslint-disable-next-line react/prop-types
export default function EnhancedTable({
  disableSelect,
  orderByStart = 'name',
  headCells,
  rows,
  idKey = 'id',
}: EnhancedTableProps): React.ReactElement {
  const { classes } = useEnhancedStyles()
  const [order, setOrder] = useLocalStorage<Order>('EnhancedTable:order', 'asc')
  const [orderBy, setOrderBy] = useLocalStorage<string>('EnhancedTable:orderByStart', orderByStart)
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [filterName, setFilterName] = useState('')
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

  const isSelected = (name: string) => selected.includes(name)

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    setPage(0)
  }

  const dataFiltered = applySortFilter({
    tableData: rows,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  // eslint-disable-next-line react/prop-types
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table aria-labelledby='tableTitle' size='small' aria-label='enhanced table' data-cy='table-enhanced'>
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
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isItemSelected = isSelected(row.name as string)
                const labelId = `enhanced-table-checkbox-${index}`
                const key = `row-${typeof idKey === 'function' ? idKey(row) : row[idKey]}`
                return (
                  <StyledTableRow
                    hover
                    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
                    onClick={(event) => handleClick(event, row.name as string)}
                    role='checkbox'
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={key}
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
                  </StyledTableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </div>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: any
  comparator: (a: any, b: any) => number
  filterName: string
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1,
    )
  }

  return tableData
}
