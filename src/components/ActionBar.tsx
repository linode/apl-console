import React from 'react'
import Button from 'react-bootstrap/Button'
import Navbar from 'react-bootstrap/Navbar'
import { useApi } from '../hooks/api'

const ActionBar: React.FC = ({ children, client }: any): any => {
  const onDeployButtonClick = (): any => {
    const [result, deploying, error] = useApi('deploy')
    if (result) {
      console.log('Scheduled for deployment')
    }
    if (error) {
      console.log(error)
    }
  }
  return (
    <Navbar bg='light' expand='sm'>
      <Navbar.Brand>Toolbox</Navbar.Brand>

      <Navbar.Collapse id='basic-navbar-nav'>
        <div className='mr-auto'>{children}</div>

        <Button onClick={onDeployButtonClick} variant='dark' size='sm'>
          Commit
        </Button>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default ActionBar
