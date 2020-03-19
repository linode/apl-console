import Avatar from '@material-ui/core/Avatar'
import React from 'react'
import { useSession } from '../session-context'

export default (): any => {
  const { user, team } = useSession()
  return (
    <React.Fragment>
      <Avatar />
      {/* <Box component="span" m={1}> */}
      {`${user.email} (${team.name})`}
      {/* </Box> */}
    </React.Fragment>
  )
}
