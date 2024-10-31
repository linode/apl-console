import { Box, Button, Modal, styled } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useLocalStorage } from 'react-use'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
}))

const ModalContent = styled('div')({
  padding: '32px',
})

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
  gap: '10px',
})

interface Props {
  open: boolean
  handleClose: () => void
  appName: string
  required: boolean
}

export default function StyledModal({ open, handleClose, appName, required }: Props) {
  const name = `${appName[0].toUpperCase()}${appName.slice(1).toLowerCase()}`
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const history = useHistory()
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        <ModalContent>
          <Box>
            {required
              ? `${name} requires object storage to be activated.`
              : `${name} can be activated without object storage, but using it is preferred.`}
          </Box>
        </ModalContent>

        <ModalFooter>
          <Button variant='outlined' color='primary' onClick={handleClose}>
            Skip
          </Button>
          {!required && (
            <Button variant='outlined' color='primary' onClick={() => console.log('Enable')}>
              {`Enable ${name}`}
            </Button>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={() => {
              handleClose()
              setShowObjWizard(true)
              history.push('/maintenance')
            }}
          >
            Show Object Storage Wizard
          </Button>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
