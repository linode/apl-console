import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { useCreateObjWizardMutation, useGetObjWizardQuery } from 'redux/otomiApi'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'providers/Session'
import { skipToken } from '@reduxjs/toolkit/dist/query'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 620,
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

export default function StyledModal() {
  const {
    user: { isPlatformAdmin },
    settings: {
      otomi: { isPreInstalled },
    },
  } = useSession()
  const [showObjWizard, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard')
  const [accepted, setAccepted] = useState(false)
  const [apiToken, setApiToken] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(false)
  const [create] = useCreateObjWizardMutation()
  const { data } = useGetObjWizardQuery(!isPlatformAdmin && skipToken)

  useEffect(() => {
    if (showObjWizard === undefined) setShowObjWizard(data?.showWizard)
    if (data?.regionId) setRegion(data.regionId)
    if (!isPreInstalled) setShowObjWizard(false)
  }, [data, isPreInstalled])

  if (!isPlatformAdmin || !isPreInstalled) return null

  const handleSkip = () => {
    create({ body: { showWizard: false } })
    setShowObjWizard(false)
  }
  const handleSubmit = () => {
    setLoading(true)
    create({ body: { apiToken, showWizard: false, regionId: region } }).then(() => {
      setLoading(false)
      setShowObjWizard(false)
    })
  }
  return (
    <Modal open={showObjWizard}>
      <ModalBox>
        <ModalContent>
          {!accepted ? (
            <Box>
              <Typography variant='body1'>
                It is recommended to use object storage for long term storage of logs and images. It is required to use
                object storage for the automated backups and storing traces and metrics.
              </Typography>
              <Typography variant='body1' mt={2}>
                Would you like to configure object storage now?
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
                required
              />
              <Typography variant='body2' mt={2}>
                <Link
                  href='https://apl-docs.net/docs/get-started/installation/akamai-connected-cloud#provision-object-storage-for-the-application-platform'
                  target='_blank'
                  rel='noopener'
                >
                  How to create an API token?
                </Link>
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }} required>
                <InputLabel id='region-label'>Region</InputLabel>
                <Select
                  labelId='region-label'
                  id='region'
                  value={region}
                  label='Region'
                  disabled={!!data?.regionId}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {data?.regions?.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {region.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </ModalContent>

        <ModalFooter>
          <Button variant='outlined' color='primary' onClick={handleSkip} disabled={loading}>
            Skip for now
          </Button>

          {!accepted ? (
            <Button variant='contained' color='primary' onClick={() => setAccepted(true)}>
              Yes
            </Button>
          ) : (
            <LoadingButton
              variant='contained'
              color='primary'
              disabled={!apiToken || !region}
              onClick={handleSubmit}
              loading={loading}
            >
              Submit
            </LoadingButton>
          )}
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
