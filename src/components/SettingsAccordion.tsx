import React, { useState } from 'react'
import Accordion from '@material-ui/core/Accordion'
import {
  AccordionDetails,
  AccordionSummary,
  Typography,
  Box,
  Button,
  Container,
  AccordionActions,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Settings } from '@redkubes/otomi-api-client-axios'
import Form from './rjsf/Form'

interface Props {
  header: string
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
  schema: any
}

export default ({ header, formData, setFormData, schema }: Props): React.ReactElement => {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{header.charAt(0).toUpperCase() + header.slice(1)}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          <Form schema={schema} formData={formData} onSubmit={(e) => setFormData(e.formData)} aria-label='Input'>
            <Box display='flex' flexDirection='row-reverse' m={1}>
              <Button variant='contained' color='primary' type='submit' data-cy='button-submit-team'>
                Submit
              </Button>
            </Box>
          </Form>
        </Container>
      </AccordionDetails>
    </Accordion>
  )
}
