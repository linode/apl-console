import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { Paper } from './Paper'
import { Typography } from './Typography'

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.cl.text.title,
}))

const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.cl.text.subTitle,
  maxWidth: '85%',
  fontSize: '0.9rem',
  marginTop: '5px',
}))

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none !important',
  margin: '0px !important',
  '&:before': {
    display: 'none',
  },
}))

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  // Remove the default expand icon container by not using the expandIcon prop
  padding: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
  minHeight: '0!important',
}))

interface StyledAccordionDetailsProps {
  noMarginTop?: boolean
}

const StyledAccordionDetails = styled(AccordionDetails, {
  shouldForwardProp: (prop) => prop !== 'noMarginTop',
})<StyledAccordionDetailsProps>(({ noMarginTop }) => ({
  padding: 0,
  marginTop: noMarginTop ? '0px' : '20px',
}))

interface Props {
  collapsable?: boolean
  description?: string
  title?: string
  children?: React.ReactNode
  noPaddingTop?: boolean
  noMarginTop?: boolean
  sx?: object
}

export default function Section(props: Props) {
  const { title, description, collapsable, children, noPaddingTop, noMarginTop, sx } = props
  const [expanded, setExpanded] = useState(true)

  const handleAccordionChange = () => {
    setExpanded((prev) => !prev)
  }

  if (collapsable) {
    return (
      <Paper noPaddingTop={noPaddingTop} sx={{ p: '20px', ...sx }}>
        <StyledAccordion disableGutters expanded={expanded} onChange={handleAccordionChange}>
          <StyledAccordionSummary>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {title && <StyledTitle variant='h6'>{title}</StyledTitle>}
                <KeyboardArrowRight
                  sx={{
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
              </div>
              {description && <StyledDescription>{description}</StyledDescription>}
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails noMarginTop={noMarginTop}>{children}</StyledAccordionDetails>
        </StyledAccordion>
      </Paper>
    )
  }

  return (
    <Paper noPaddingTop={noPaddingTop} sx={{ ...sx }}>
      {title && <StyledTitle variant='h6'>{title}</StyledTitle>}
      {description && <StyledDescription>{description}</StyledDescription>}
      {children}
    </Paper>
  )
}
