import { Container } from '@material-ui/core'
import React from 'react'
import { AdminMenu, TeamMenu } from '../components/Menus'
import { getIsAdmin, useSession } from '../session-context'

export default ({ children }): any => {
  const { team } = useSession()
  const isAdmin = getIsAdmin()
  return (
    <Container maxWidth='md'>
      <AdminMenu />
      {!isAdmin && <TeamMenu teamName={team.name} />}
      <div className='main'>{children}</div>
    </Container>
  )
}
