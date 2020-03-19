import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { useApi } from '../hooks/api'
import { useSnackbar } from '../utils/snackbar'

const Deploy = (): any => {
  const { enqueueSnackbar } = useSnackbar()
  const [result] = useApi('deploy')
  if (result) {
    enqueueSnackbar('Scheduled for deployment')
  }
  return null
}

const ActionBar = ({ children, client }: any): any => {
  const [deployed, setDeployed] = useState(false)
  return (
    <Navbar bg='light' expand='sm'>
      <Navbar.Brand>Toolbox</Navbar.Brand>

      <Navbar.Collapse id='basic-navbar-nav'>
        <div className='mr-auto'>{children}</div>

        <Button onClick={setDeployed.bind(this, true)} variant='dark' size='sm'>
          Commit
        </Button>
      </Navbar.Collapse>
      {deployed && <Deploy />}
    </Navbar>
  )
}

export default ActionBar
