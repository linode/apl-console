import React from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { IoIosHelpCircle } from 'react-icons/io'

interface HelpProps {
  id: string
  description: string
}

const Help = ({ id, description }: HelpProps) => (
  <OverlayTrigger placement='right' delay={{ show: 250, hide: 400 }} overlay={<Tooltip id={id}>{description}</Tooltip>}>
    <IoIosHelpCircle />
  </OverlayTrigger>
)

export default Help
