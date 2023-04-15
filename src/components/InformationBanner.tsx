import { Box, Typography, styled } from '@mui/material'
import Iconify from './Iconify'

const StyledInfoBanner = styled(Box)({
  backgroundColor: '#f2f2894d',
  padding: '10px',
  border: '1px solid #d4d402',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
})

interface Props {
  message: string
}

export default function InformationBanner({ message }: Props) {
  return (
    <StyledInfoBanner>
      <Iconify icon='material-symbols:info' width={40} height={28} color='#c7d030d9' />
      <Typography>{message}</Typography>
    </StyledInfoBanner>
  )
}
