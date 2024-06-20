import { Divider } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledSectionDivider = styled(Divider)(({ theme }) => ({
  marginTop: 12,
  marginBottom: 24,
}))

export default function SectionDivider() {
  return <StyledSectionDivider />
}
