import { Box, Button, Modal, styled } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useLocalStorage } from 'react-use'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 620,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  fontFamily: theme.font.normal,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  padding: 0,
}))

const ModalContent = styled('div')({
  padding: '32px',
})

const ModalFooter = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
  gap: '10px',
  '& .MuiButton-root': {
    borderWidth: '1px',
    borderRadius: 0,
    boxShadow: 'none',
    fontFamily: theme.font.normal,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
  },
  '& .MuiButton-outlinedPrimary:not(.Mui-disabled)': {
    color: theme.palette.cm.linkActiveLight,
    borderColor: theme.palette.cm.textBoxBorder,
    '&:hover': {
      color: theme.palette.cm.buttonPrimaryHover,
      borderColor: theme.palette.cm.buttonPrimaryHover,
    },
  },
  '& .MuiButton-containedPrimary:not(.Mui-disabled)': {
    backgroundColor: theme.palette.cm.linkActiveLight,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.cm.buttonPrimaryHover,
    },
  },
}))

interface Props {
  open: boolean
  handleClose: () => void
  appId: string
  required: boolean
  toggleApp?: any
}

export default function StyledModal({ open, handleClose, appId, required, toggleApp }: Props) {
  const name = `${appId[0].toUpperCase()}${appId.slice(1).toLowerCase()}`
  const [, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const history = useHistory()
  const handleEnable = () => {
    toggleApp()
    handleClose()
  }
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
            Cancel
          </Button>
          {!required && (
            <Button variant='outlined' color='primary' onClick={handleEnable}>
              Enable Without Object Storage
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
            Start Object Storage Wizard
          </Button>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
