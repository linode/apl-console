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
  color: theme.palette.text.primary,
  fontFamily: theme.font.normal,
  fontSize: '14px',
  lineHeight: '20px',
  fontWeight: 400,
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 0,
  padding: 0,
}))

const ModalHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '20px',
  paddingLeft: '32px',
  paddingTop: '32px',
  paddingRight: '32px',
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

const ModalContent = styled('div')(({ theme }) => ({
  padding: '32px',
  '& .MuiTypography-body1, & .MuiTypography-body2': {
    fontFamily: theme.font.normal,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
  },
}))

const ModalFooter = styled('div')(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px',
  paddingRight: '30px',
  '& .MuiButton-root': {
    borderWidth: '1px',
    borderRadius: 0,
    boxShadow: 'none',
    fontFamily: theme.font.normal,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
  },
  '& .MuiButton-containedPrimary:not(.Mui-disabled)': {
    backgroundColor: theme.palette.cm.linkActiveLight,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.cm.buttonPrimaryHover,
    },
  },
}))

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
            <Typography variant='h5' sx={{ fontFamily: (theme) => theme.font.normal, fontWeight: 700 }}>
              {title}
            </Typography>
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'text.secondary',
                borderRadius: 0,
                fontFamily: (theme) => theme.font.normal,
                fontSize: '14px',
                lineHeight: '20px',
                fontWeight: 400,
              }}
            >
              X
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
              sx={{ ml: 1 }}
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
