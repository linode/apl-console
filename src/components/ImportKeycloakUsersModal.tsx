import { Alert, Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import CopyToClipboard from 'components/CopyToClipboard'
import Modal from 'components/Modal'
import { ImportKeycloakUsersApiResponse, useImportKeycloakUsersMutation } from 'redux/otomiApi'

type ImportResult = ImportKeycloakUsersApiResponse['results'][number]

interface Props {
  open: boolean
  handleClose: () => void
}

export default function ImportKeycloakUsersModal({ open, handleClose }: Props) {
  const [importKeycloakUsers, { data, isLoading, reset }] = useImportKeycloakUsersMutation()

  const close = () => {
    reset()
    handleClose()
  }

  const closeUnlessBackdropClick = (_event: unknown, reason?: string) => {
    if (reason !== 'backdropClick') close()
  }

  const startImport = () => {
    if (isLoading) return
    importKeycloakUsers().unwrap().catch(close)
  }

  if (data) {
    return (
      <Modal open={open} title='Imported Keycloak users' handleClose={closeUnlessBackdropClick} noFooter>
        <ImportResults results={data.results} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant='contained' onClick={close}>
            Done
          </Button>
        </Box>
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      title='Import Keycloak users'
      handleClose={close}
      handleAction={startImport}
      actionButtonText={isLoading ? 'Importing...' : 'Import'}
      actionButtonColor='primary'
    >
      <Typography>
        Creates a Dex user, with a new password, for every user created through App Platform. Users that already exist
        in Dex are left unchanged.
      </Typography>
    </Modal>
  )
}

function ImportResults({ results }: { results: ImportResult[] }) {
  const createdUsers = results.filter((result) => result.status === 'created')
  const credentials = createdUsers.map((user) => `${user.email} ${user.initialPassword}`).join('\n')

  return (
    <>
      {createdUsers.length > 0 && (
        <Alert severity='warning' action={<CopyToClipboard text={credentials} tooltipTitle='Copy all passwords' />}>
          Save these passwords now. They are not stored and will not be shown again.
        </Alert>
      )}
      <Table size='small' sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Password / reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result) => (
            <TableRow key={result.email}>
              <TableCell>{result.email}</TableCell>
              <TableCell>{result.status}</TableCell>
              <TableCell>{result.initialPassword ?? result.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
