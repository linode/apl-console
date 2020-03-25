import React from 'react'
import Navbar from 'react-bootstrap/Navbar'

const ActionBar = ({ children }): any => {
  return (
    <Navbar bg='light' expand='sm'>
      {children}
    </Navbar>
  )
}

export default ActionBar
