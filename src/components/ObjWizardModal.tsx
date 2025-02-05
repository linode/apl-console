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
import { useCreateObjWizardMutation } from 'redux/otomiApi'
import { LoadingButton } from '@mui/lab'
import { useSession } from 'providers/Session'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { isEmpty } from 'lodash'
import InformationBanner from './InformationBanner'

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

// interfaces ----------------------------------------------------------------
interface ObjWizardResponse {
  data: {
    status: string
    errorMessage: string
    objBuckets: Array<string>
  }
}

export default function StyledModal() {
  const {
    user: { isPlatformAdmin },
    settings: {
      otomi: { isPreInstalled },
    },
    objectStorage: { objStorageRegions, showWizard },
  } = useSession()
  const [showObjWizard, setShowObjWizard] = useLocalStorage<boolean>('showObjWizard', !!showWizard)
  const [accepted, setAccepted] = useState(false)
  const [apiToken, setApiToken] = useState('')
  const [regionId, setRegionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [wizardSuccess, setWizardSuccess] = useState<Array<string>>([])
  const [wizardError, setWizardError] = useState<string>('')
  const [create] = useCreateObjWizardMutation<FetchBaseQueryError>()
  useEffect(() => {
    if (showObjWizard === undefined) setShowObjWizard(!!showWizard)
    if (!isPreInstalled) setShowObjWizard(false)
  }, [isPreInstalled])
  if (!isPlatformAdmin || !isPreInstalled) return null
  const handleSkip = () => {
    create({ body: { showWizard: false } })
    setShowObjWizard(false)
  }
  const handleSubmit = () => {
    setLoading(true)
    create({ body: { apiToken, showWizard: false, regionId } }).then((response) => {
      setLoading(false)
      if ((response as ObjWizardResponse).data.status === 'error')
        setWizardError((response as ObjWizardResponse).data.errorMessage)
      else {
        setWizardSuccess((response as ObjWizardResponse).data.objBuckets)
        setWizardError('')
      }
    })
  }
  const handleClose = () => {
    setShowObjWizard(false)
    // refresh the page to get the new session/settings
    window.location.reload()
  }
  return (
    <Modal open={showObjWizard}>
      <ModalBox>
        <ModalContent>
          {!accepted && isEmpty(wizardSuccess) && (
            <Box>
              <Typography variant='body1'>
                It is recommended to use object storage for long term storage of logs and images. It is required to use
                object storage for the automated backups and storing traces and metrics.
              </Typography>
              <Typography variant='body1' mt={2}>
                Would you like to configure object storage now?
              </Typography>
            </Box>
          )}
          {accepted && isEmpty(wizardSuccess) && (
            <Box>
              {!isEmpty(wizardError) && (
                <InformationBanner message={`The Wizard encountered a problem: ${wizardError} Please retry!`} />
              )}
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
                  value={regionId}
                  label='Region'
                  onChange={(e) => setRegionId(e.target.value)}
                >
                  {objStorageRegions?.map((region) => (
                    <MenuItem key={region.id} value={region.id}>
                      {`${region.label} (${region.id})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {accepted && !isEmpty(wizardSuccess) && (
            <Box>
              <Typography variant='body1' sx={{ marginBottom: 2 }}>
                Buckets with the following names have been created in region {regionId}:
              </Typography>
              <Box component='ul' sx={{ listStyle: 'inside', listStyleType: 'disc' }}>
                {wizardSuccess.map((item) => (
                  <Typography component='li' variant='body1' sx={{ marginLeft: 2, display: 'list-item' }}>
                    {item}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}
        </ModalContent>

        <ModalFooter>
          {isEmpty(wizardSuccess) && (
            <Button variant='outlined' color='primary' onClick={handleSkip} disabled={loading}>
              Skip for now
            </Button>
          )}
          {!accepted && isEmpty(wizardSuccess) && (
            <Button variant='contained' color='primary' onClick={() => setAccepted(true)}>
              Yes
            </Button>
          )}
          {accepted && isEmpty(wizardSuccess) && (
            <LoadingButton
              variant='contained'
              color='primary'
              disabled={!apiToken || !regionId}
              onClick={handleSubmit}
              loading={loading}
            >
              Submit
            </LoadingButton>
          )}
          {accepted && !isEmpty(wizardSuccess) && (
            <Button variant='contained' color='primary' onClick={handleClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalBox>
    </Modal>
  )
}
