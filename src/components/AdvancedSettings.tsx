import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material'
import { KeyboardArrowRight } from '@mui/icons-material'
import { Typography } from './Typography'

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.cl.text.title,
}))

const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.cl.text.subTitle,
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none !important',
  margin: '0px !important',
  '&:before': {
    display: 'none', // Remove the default border above the accordion
  },
}))

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  marginTop: '0px',
  padding: 0,
  '&:before': {
    display: 'none', // Remove the default border above the accordion
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: '0',
  '.MuiAccordionSummary-content': {
    margin: '0', // Remove margin between text and icon
  },
  marginTop: '0px !important',
  display: 'inline-flex',
}))

interface Props {
  description?: string
  title?: string
  children?: React.ReactNode
  noPaddingTop?: boolean
}

export default function AdvancedSettings(props: Props) {
  const { title = 'Advanced Settings', description, children, noPaddingTop } = props
  const [expanded, setExpanded] = useState(true)

  const handleAccordionChange = () => {
    setExpanded((prev) => !prev)
  }

  return (
    <StyledAccordion disableGutters expanded={expanded} onChange={handleAccordionChange}>
      <StyledAccordionSummary
        expandIcon={<KeyboardArrowRight />}
        sx={{
          '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(90deg)',
          },
        }}
      >
        <div>
          {title && <StyledTitle variant='subtitle1'>{title}</StyledTitle>}
          {description && <StyledDescription>{description}</StyledDescription>}
        </div>
      </StyledAccordionSummary>
      <StyledAccordionDetails>{children}</StyledAccordionDetails>
    </StyledAccordion>
  )
}
