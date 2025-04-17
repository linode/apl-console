import Box, { BoxProps } from '@mui/material/Box'
import { styled } from '@mui/material/styles'

interface ControlledBoxProps extends BoxProps {
  disabled?: boolean
}

const ControlledBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<ControlledBoxProps>(({ disabled }) => ({
  opacity: disabled ? 0.5 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
  cursor: disabled ? 'default' : 'text',
}))

export default ControlledBox
