import React from 'react'
import Button from 'react-bootstrap/Button'

import Modal from 'react-bootstrap/Modal'

const ModalWrapper = ({ onClose, title, body }: any): any => {
  const onClick = (): any => {
    onClose()
  }

  return (
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClick}>
          Close
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  )
}

export default ModalWrapper
