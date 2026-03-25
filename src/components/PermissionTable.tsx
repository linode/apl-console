import { Controller, useFormContext } from 'react-hook-form'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { Checkbox } from './cmCheckbox/Checkbox'

interface PermissionDefinition {
  id: string
  label: string
}

interface PermissionsTableProps {
  name: string
  disabled?: boolean
}

const permissionDefinitions: PermissionDefinition[] = [
  { id: 'createServices', label: 'Create Services' },
  { id: 'editSecurityPolicies', label: 'Edit Security Policies' },
  { id: 'useCloudShell', label: 'Use Cloud Shell' },
  { id: 'downloadKubeconfig', label: 'Download kubeconfig file' },
  { id: 'downloadDockerLogin', label: 'Download docker login credentials' },
]

const useStyles = makeStyles()((theme: Theme) => ({
  tableHead: {
    backgroundColor: 'transparent',
    padding: '0px 10px 15px 10px',
    marginBottom: '10px',
  },
  tableHeadText: {
    fontWeight: 'bold',
    fontSize: '1rem',
    color: theme.palette.cm.headline,
  },
  tableBody: {
    '& tr:nth-of-type(even)': {
      backgroundColor: theme.palette.cm.rowAlter,
    },
  },
  tableCell: {
    padding: '2px 10px',
  },
  alignCenter: {
    textAlign: 'center',
  },
}))

export function PermissionsTable({ name, disabled }: PermissionsTableProps) {
  const { control } = useFormContext()
  const { classes, cx } = useStyles()

  return (
    <Table sx={{ maxWidth: '800px' }}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableHead}>
            <Typography className={classes.tableHeadText}>Action</Typography>
          </TableCell>
          <TableCell className={cx(classes.tableHead, classes.alignCenter)}>
            <Typography className={classes.tableHeadText}>Team Members</Typography>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        {permissionDefinitions.map((permission) => (
          <TableRow key={permission.id}>
            <TableCell className={classes.tableCell}>{permission.label}</TableCell>
            <TableCell className={cx(classes.tableCell, classes.alignCenter)}>
              <Controller
                name={`${name}.teamMembers.${permission.id}`}
                disabled={disabled}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={disabled}
                  />
                )}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
