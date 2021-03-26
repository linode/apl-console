import React, { ComponentType } from 'react'
import Navbar from 'react-bootstrap/Navbar'

interface Props {
  children: ComponentType
}

export default ({ children }: Props): React.ReactElement => {
  return (
    <Navbar bg='light' expand='sm'>
      {children}
    </Navbar>
  )
}
