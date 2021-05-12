import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import { AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Container from '@material-ui/core/Container'
import { Settings } from '@redkubes/otomi-api-client-axios'
import ConsoleForm from './settings/ConsoleForm'
import OtomiValuesForm from './settings/OtomiValuesForm'

interface Props {
  formData: Settings
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
}

export default ({ formData, setFormData }: Props): React.ReactElement => {
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Console Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <ConsoleForm />
          </Container>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Otomi Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Container>
            <OtomiValuesForm formData={formData} setFormData={setFormData} />
          </Container>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
