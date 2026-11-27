import { Alert, Box, Button, Typography } from '@mui/material'
import EnhancedTable, { HeadCell } from 'components/EnhancedTable'
import Modal from 'components/Modal'
import { DeleteGiteaUsersApiResponse, useDeleteGiteaUsersMutation } from 'redux/otomiApi'

type GiteaUserResult = DeleteGiteaUsersApiResponse['results'][number]

const repoList = (result: GiteaUserResult) => result.repos?.join(', ') || '-'

const previewHeadCells: HeadCell[] = [
  { id: 'username', label: 'Username' },
  { id: 'email', label: 'Email' },
  { id: 'repos', label: 'Personal repositories', renderer: repoList },
]
const resultHeadCells: HeadCell[] = [
  { id: 'username', label: 'Username' },
  { id: 'status', label: 'Status' },
  {
    id: 'repos',
    label: 'Repositories / error',
    renderer: (result: GiteaUserResult) => result.error ?? repoList(result),
  },
]

interface Props {
  open: boolean
  handleClose: () => void
}

export default function DeleteGiteaUsersModal({ open, handleClose }: Props) {
  const [previewUsers, preview] = useDeleteGiteaUsersMutation()
  const [deleteUsers, deletion] = useDeleteGiteaUsersMutation()

  const close = () => {
    preview.reset()
    deletion.reset()
    handleClose()
  }

  const closeUnlessBackdropClick = (_event: unknown, reason?: string) => {
    if (reason !== 'backdropClick') close()
  }

  const startPreview = () => {
    if (preview.isLoading) return
    previewUsers({ dryRun: true }).unwrap().catch(close)
  }

  const startDeletion = () => {
    if (deletion.isLoading) return
    deleteUsers({ dryRun: false }).unwrap().catch(close)
  }

  if (deletion.data) {
    return (
      <Modal open={open} title='Deleted Gitea users' handleClose={closeUnlessBackdropClick} width={720} noFooter>
        <UserTable headCells={resultHeadCells} results={deletion.data.results} />
        <DoneButton onClick={close} />
      </Modal>
    )
  }

  if (preview.data) {
    const users = preview.data.results
    if (users.length === 0) {
      return (
        <Modal open={open} title='Delete Gitea users' handleClose={close} width={720} noFooter>
          <Typography>There are no Gitea users to delete.</Typography>
          <DoneButton onClick={close} />
        </Modal>
      )
    }
    return (
      <Modal
        open={open}
        title='Delete Gitea users'
        handleClose={closeUnlessBackdropClick}
        width={720}
        handleAction={startDeletion}
        actionButtonText={deletion.isLoading ? 'Deleting...' : `Delete ${users.length} users`}
        actionButtonColor='error'
      >
        <Alert severity='warning'>
          These users and their personal repositories will be permanently deleted. Team organizations and team
          repositories are not affected.
        </Alert>
        <UserTable headCells={previewHeadCells} results={users} />
      </Modal>
    )
  }

  return (
    <Modal
      open={open}
      title='Delete Gitea users'
      handleClose={close}
      handleAction={startPreview}
      actionButtonText={preview.isLoading ? 'Loading...' : 'Show users'}
      actionButtonColor='primary'
    >
      <Typography>
        Users who used Gitea with Keycloak cannot log in to Gitea with Dex until their old Gitea account is deleted.
        This deletes every Gitea user, together with their personal repositories. The built-in admin and otomi-admin
        accounts and the organization service accounts are kept. You first see which users will be deleted.
      </Typography>
    </Modal>
  )
}

function UserTable({ headCells, results }: { headCells: HeadCell[]; results: GiteaUserResult[] }) {
  return (
    <Box sx={{ mt: 2 }}>
      <EnhancedTable disableSelect headCells={headCells} rows={results} idKey='username' orderByStart='username' />
    </Box>
  )
}

function DoneButton({ onClick }: { onClick: () => void }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
      <Button variant='contained' onClick={onClick}>
        Done
      </Button>
    </Box>
  )
}
