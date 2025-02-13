import { styled } from '@mui/material/styles'
import { Paper } from './Paper'
import { Typography } from './Typography'

const StyledTitle = styled(Typography)(({ theme }) => ({
  marginTop: 0,
  color: theme.palette.cl.text.title,
}))

const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.cl.text.subTitle,
}))

interface Props {
  collapsable?: boolean
  description?: string
  title?: string
  children?: any
  noPaddingTop?: boolean
}

export default function Section(props: Props) {
  const { title, description, collapsable, children, noPaddingTop } = props

  return (
    <Paper noPaddingTop={noPaddingTop}>
      <StyledTitle variant='h6'>{title}</StyledTitle>
      <StyledDescription>{description}</StyledDescription>
      {children}
    </Paper>
  )
}
