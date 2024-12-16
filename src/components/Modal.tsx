import { Box, Button, ButtonPropsColorOverrides, IconButton, Modal, Typography, styled } from '@mui/material'
// eslint-disable-next-line import/no-unresolved
import { OverridableStringUnion } from '@mui/types'
import { ReactElement, ReactNode } from 'react'

// styles ----------------------------------------------------------------
const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow:
    'rgb(0 0 0 / 20%) 0px 11px 15px -7px, rgb(0 0 0 / 14%) 0px 24px 38px 3px, rgb(0 0 0 / 12%) 0px 9px 46px 8px',
  borderRadius: 16,
  padding: 0,
}))

const ModalHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '20px',
  paddingLeft: '32px',
  paddingTop: '32px',
  paddingRight: '32px',
  borderBottom: '1px dashed rgba(145, 158, 171, 0.24)',
})

const ModalContent = styled('div')({
  padding: '32px',
})

const ModalFooter = styled('div')({
  borderTop: '1px dashed rgba(145, 158, 171, 0.24)',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
})

// interface and component -----------------------------------------------
interface Props {
  title?: string
  noHeader?: boolean
  noFooter?: boolean
  children: ReactNode
  open: boolean
  handleClose: any
  handleCancel?: any
  cancelButtonText?: string
  handleAction?: any
  actionButtonText?: string
  actionButtonColor?: OverridableStringUnion<
    'inherit' | 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >
  actionButtonEndIcon?: ReactElement
  actionButtonFrontIcon?: ReactElement
}

export default function StyledModal({
  title,
  noHeader,
  noFooter,
  children,
  open,
  handleClose,
  handleCancel,
  cancelButtonText,
  handleAction,
  actionButtonText,
  actionButtonColor,
  actionButtonEndIcon,
  actionButtonFrontIcon,
}: Props) {
  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        {!noHeader && (
          <ModalHeader>
            <Typography variant='h5'>{title}</Typography>
            <IconButton color='primary' onClick={handleClose}>
              {/* <Iconify icon='eva:close-outline' width={30} height={30} sx={{ color: '#aeaeae' }} /> */}X
            </IconButton>
          </ModalHeader>
        )}
        <ModalContent>{children}</ModalContent>
        {!noFooter && (
          <ModalFooter>
            <Button variant='text' color='inherit' onClick={handleCancel ?? handleClose}>
              {cancelButtonText ?? 'Cancel'}
            </Button>
            <Button
              variant='contained'
              color={actionButtonColor || 'error'}
              sx={{ ml: 1, bgcolor: actionButtonColor }}
              onClick={handleAction}
              startIcon={actionButtonFrontIcon && actionButtonFrontIcon}
              endIcon={actionButtonEndIcon && actionButtonEndIcon}
            >
              {actionButtonText}
            </Button>
          </ModalFooter>
        )}
      </ModalBox>
    </Modal>
  )
}
