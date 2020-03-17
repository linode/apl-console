import React from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { IoIosHelpCircle } from 'react-icons/io'

const Help: React.FC = (props: any): any => (
  <OverlayTrigger
    placement='right'
    delay={{ show: 250, hide: 400 }}
    overlay={
      <Tooltip id='help' {...props}>
        {props.description}
      </Tooltip>
    }
  >
    <IoIosHelpCircle />
  </OverlayTrigger>
)

export default Help
