import React from 'react'
import UserMenu from './UserMenu'

const PrivateContainer: React.FC = ({ children }): any => {
  return (
    <React.Fragment>
      <UserMenu />
      {children}
    </React.Fragment>
  )
}

export default PrivateContainer
