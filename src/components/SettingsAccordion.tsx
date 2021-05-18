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
import {
  SettingsAlerts,
  SettingsAlertsEmail,
  SettingsAzure,
  SettingsAzureAppgw,
  SettingsCustomer,
  SettingsOidc,
  SettingsOtomi,
  SettingsOtomiAddons,
  SettingsOtomiAddonsConftest,
  SettingsSmtp,
} from '@redkubes/otomi-api-client-axios'
import { isEqual } from 'lodash'
import { JSONSchema7 } from 'json-schema'
import Form from './rjsf/Form'

type Settings =
  | SettingsAlerts
  | SettingsAlertsEmail
  | SettingsAzure
  | SettingsAzureAppgw
  | SettingsCustomer
  | SettingsOidc
  | SettingsOtomi
  | SettingsOtomiAddons
  | SettingsOtomiAddonsConftest
  | SettingsSmtp

interface Props {
  header: string
  settings: Settings
  onSubmit: CallableFunction
  schema: JSONSchema7
}

export default ({ header, settings, onSubmit, schema }: Props): React.ReactElement => {
  const [data, setData]: any = useState(settings[header])
  const [dirty, setDirty] = useState(false)
  const handleChange = ({ formData }) => {
    setData(formData)
    setDirty(!isEqual(formData, settings[header]))
  }
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{header}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Container>
          <Form
            schema={schema}
            formData={data}
            onSubmit={(e) => onSubmit({ ...settings, [header]: e.formData })}
            onChange={handleChange}
            aria-label='Input'
          >
            <Box display='flex' flexDirection='row-reverse' m={1}>
              <Button variant='contained' color='primary' type='submit' data-cy='button-submit-team' disabled={!dirty}>
                Submit
              </Button>
            </Box>
          </Form>
        </Container>
      </AccordionDetails>
    </Accordion>
  )
}
