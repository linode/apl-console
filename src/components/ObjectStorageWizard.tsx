import { Box, Button, Modal, styled } from '@mui/material'
import { useLocalStorage } from 'react-use'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 500,
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
})

// interface and component -----------------------------------------------
interface Props {
  open?: boolean
}

export default function StyledModal({ open = true }: Props) {
  const [isWizardSkipped, setWizardSkipped] = useLocalStorage<string>('isWizardSkipped', JSON.stringify(false))
  const handleSkip = () => {
    setWizardSkipped(JSON.stringify(true))
  }
  return (
    <Modal open={!JSON.parse(isWizardSkipped)}>
      <ModalBox>
        <ModalContent>
          <Box>Wizard Content</Box>
        </ModalContent>

        <ModalFooter>
          <Button variant='contained' color='primary' onClick={handleSkip}>
            Skip
          </Button>
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
