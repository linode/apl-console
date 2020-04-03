import React from 'react'
import Navbar from 'react-bootstrap/Navbar'

export default ({ children }): any => {
  return (
    <Navbar bg='light' expand='sm'>
      {children}
    </Navbar>
  )
}
