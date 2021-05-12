import React, { useState } from 'react'
import Accordion from '@material-ui/core/Accordion'
import { AccordionDetails, AccordionSummary, Typography, Box, Button } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Settings } from '@redkubes/otomi-api-client-axios'
import Form from '../rjsf/Form'
import { getSettingsSchema } from '../../api-spec'

interface Props {
  formData: Settings
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
  key: string
}

export default ({ formData, setFormData, key }: Props): React.ReactElement => {
  const [state, setState] = useState(formData)

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Alerts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Form
            schema={{}}
            formData={state}
            onChange={(e) => setState(e.formData)}
            onSubmit={(e) => setFormData(e.formData)}
          >
            <Box display='flex' flexDirection='row-reverse' m={1}>
              <Button variant='contained' color='primary' type='submit' data-cy='button-submit-team'>
                Submit
              </Button>
            </Box>
          </Form>
        </AccordionDetails>
      </Accordion>
    </>
  )
}
