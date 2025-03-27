import React from 'react'
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
}

const permissionDefinitions: PermissionDefinition[] = [
  { id: 'createServices', label: 'Create Services' },
  { id: 'editSecurityPolicies', label: 'Edit Security Policies' },
  { id: 'useCloudShell', label: 'Use Cloud Shell' },
  { id: 'downloadKubeconfig', label: 'Download kubeconfig file' },
  { id: 'downloadDockerLogin', label: 'Download docker login credentials' },
  // { id: 'enableMonitoring', label: 'Enable Monitoring' },
  // { id: 'configureAlerts', label: 'Configure Alert Engine' },
]

const useStyles = makeStyles()((theme: Theme) => ({
  tableHead: {
    backgroundColor: 'transparent',
    padding: '0px 10px 15px 10px',
    marginBottom: '10px',
  },
  tableBody: {
    '& tr:nth-of-type(even)': {
      backgroundColor: '#47474D',
    },
  },
  tableCell: {
    padding: '2px 10px',
  },
  alignCenter: {
    textAlign: 'center',
  },
}))

export function PermissionsTable({ name }: PermissionsTableProps) {
  const { register, control } = useFormContext()
  const { classes, cx } = useStyles()

  return (
    <Table sx={{ maxWidth: '800px' }}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableHead}>
            <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>Action</Typography>
          </TableCell>
          <TableCell className={cx(classes.tableHead, classes.alignCenter)}>
            <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>Team Members</Typography>
          </TableCell>
          {/* <TableCell className={cx(classes.tableHead, classes.alignCenter)}>
            <Typography sx={{ fontWeight: 'bold', color: '#fff' }}>Team Admins</Typography>
          </TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody className={classes.tableBody}>
        {permissionDefinitions.map((permission) => (
          <TableRow key={permission.id}>
            <TableCell className={classes.tableCell}>{permission.label}</TableCell>
            <TableCell className={cx(classes.tableCell, classes.alignCenter)}>
              <Controller
                name={`${name}.teamMembers.${permission.id}`}
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </TableCell>
            {/* <TableCell className={cx(classes.tableCell, classes.alignCenter)}>
              <Checkbox {...register(`${name}.${permission.id}.teamAdmins`)} />
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
