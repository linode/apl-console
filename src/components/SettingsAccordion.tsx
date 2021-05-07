import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import { AccordionDetails, AccordionSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Container from '@material-ui/core/Container'
import ConsoleForm from './settings/ConsoleForm'

export default (): React.ReactElement => {
  return (
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
  )
}
