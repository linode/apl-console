import { Box, Button, Link, Modal, TextField, Typography, styled } from '@mui/material'
import { useState } from 'react'
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

// interface and component -----------------------------------------------
interface Props {
  open?: boolean
}

export default function StyledModal({ open = true }: Props) {
  const [isWizardSkipped, setWizardSkipped] = useLocalStorage<string>('isWizardSkipped', JSON.stringify(false))
  const [accepted, setAccepted] = useState(false)
  const [apiToken, setApiToken] = useState('')
  const handleSkip = () => {
    setWizardSkipped(JSON.stringify(true))
  }
  const handleAccept = () => {
    setAccepted(true)
  }
  const handleSubmit = () => {
    console.log('API Token:', apiToken)
  }
  return (
    <Modal open={!JSON.parse(isWizardSkipped)}>
      <ModalBox>
        <ModalContent>
          {!accepted ? (
            <Box>
              <Typography variant='body1'>
                The Application Platform requires Object Storage to support long term retention of logs, metrics and
                traces, and storing backups and created container images.
              </Typography>
              <Typography variant='body1' mt={2}>
                Would you like the Platform to create all the required buckets for you?
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant='body1'>
                The Application Platform needs an API Token to create the Object Storage.
              </Typography>
              <TextField
                label='API Token'
                fullWidth
                onChange={(e) => {
                  setApiToken(e.target.value)
                }}
              />
              <Typography variant='body2' mt={2}>
                <Link href='https://example.com/how-to-create-api-token' target='_blank' rel='noopener'>
                  How to create an API token?
                </Link>
              </Typography>
            </Box>
          )}
        </ModalContent>

        <ModalFooter>
          <Button variant='outlined' color='primary' onClick={handleSkip}>
            Skip
          </Button>

          {!accepted ? (
            <Button variant='contained' color='primary' onClick={handleAccept}>
              Yes
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Button variant='outlined' color='primary' onClick={() => setAccepted(false)}>
                Previous
              </Button>
              <Button variant='contained' color='primary' disabled={!apiToken} onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          )}
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
