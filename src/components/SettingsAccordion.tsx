import React, { useState } from 'react'
import Accordion from '@material-ui/core/Accordion'
import { AccordionDetails, AccordionSummary, Typography, Box, Button } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Settings } from '@redkubes/otomi-api-client-axios'
import Form from './rjsf/Form'
import { getSettingsSchema } from '../api-spec'

interface Props {
  header: string
  formData: any
  setFormData: React.Dispatch<React.SetStateAction<boolean>>
}

export default ({ header, formData, setFormData }: Props): React.ReactElement => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{header}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Form
          schema={getSettingsSchema()}
          formData={formData}
          onChange={(e) => setFormData(e.formData)}
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
  )
}
