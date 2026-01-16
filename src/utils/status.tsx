import { CircularProgress, Tooltip } from '@mui/material'
import Iconify from '../components/Iconify'

export type Status = 'NotFound' | 'Failed' | 'Unknown' | 'Pending' | 'Succeeded' | 'Running' | 'Indexed'

export const getStatus = (status: Status) => {
  if (!status || status === 'NotFound') return <CircularProgress size='22px' />
  switch (status) {
    case 'Failed':
      return (
        <Tooltip title={status} arrow>
          <span>
            <Iconify color='#FF4842' icon='eva:alert-circle-fill' width={22} height={22} />
          </span>
        </Tooltip>
      )
    case 'Pending':
      return (
        <Tooltip title={status} arrow>
          <span>
            <Iconify color='#FFC107' icon='eva:alert-triangle-fill' width={22} height={22} />
          </span>
        </Tooltip>
      )
    case 'Succeeded':
    case 'Running':
    case 'Indexed':
      return (
        <Tooltip title={status} arrow>
          <span>
            <Iconify color='#54D62C' icon='eva:checkmark-circle-2-fill' width={22} height={22} />
          </span>
        </Tooltip>
      )
    default:
      return <CircularProgress size='22px' />
  }
}
