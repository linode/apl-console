import { Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledSectionCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#323A44' : '#FCFCFC',
  padding: 24,
  margin: 5,
  marginTop: 25,
}))

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: 10,
}))

const StyledSubTitle = styled(Typography)(({ theme }) => ({
  color: '#919EAB',
}))

type Props = {
  title: string
  subTitle?: string
  children: any
}

export default function SectionCard({ title, subTitle, children }: Props) {
  return (
    <StyledSectionCard>
      <StyledTitle variant='h5'>{title}</StyledTitle>
      <StyledSubTitle>{subTitle}</StyledSubTitle>
      {children}
    </StyledSectionCard>
  )
}
