import { Box, Button, Modal, Typography, styled } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { MigrateSecretsApiResponse } from 'redux/otomiApi'
import Iconify from './Iconify'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
}))

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
})

// interface and component -----------------------------------------------

function InfoBox({ label, value }: { label: string; value: number | string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Box>{label}</Box>
      <Box sx={{ fontWeight: 'bold' }}>{value}</Box>
    </Box>
  )
}

interface Props {
  open: boolean
  handleClose: any
  data: MigrateSecretsApiResponse
}

export default function StyledModal({ open, handleClose, data }: Props) {
  const { status, message, total, migrated, remaining } = data
  const icons = {
    success: 'eva:checkmark-circle-2-fill',
    error: 'eva:alert-circle-fill',
    info: 'eva:info-fill',
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        <Box sx={{ p: '32px' }}>
          {status && (
            <Box
              sx={{
                mr: 1.5,
                width: 120,
                height: 120,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                justifyContent: 'center',
                color: `${status}.main`,
                bgcolor: (theme) => alpha(theme.palette[status].main, 0.16),
                ml: 'calc(50% - 60px)',
                mb: '1rem',
              }}
            >
              <Iconify icon={icons[status]} width={80} height={80} />
            </Box>
          )}
          <Typography>{message}</Typography>
          {total && (
            <Box sx={{ mt: '1rem', width: '50%' }}>
              <InfoBox label='Total Secrets' value={total} />
              <InfoBox label='Successfully Migrated' value={migrated} />
              <InfoBox label='Remaining' value={remaining} />
            </Box>
          )}
        </Box>
        <ModalFooter>
          <Button variant='contained' color='error' sx={{ ml: 1 }} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
