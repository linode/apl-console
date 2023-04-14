import { ListItem, ListSubheader, MenuItem } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

function OListItem(props): React.ReactElement {
  return <ListItem {...props} />
}
// eslint-disable-next-line react/prop-types
function OMenuItem({ classes, ...props }): React.ReactElement {
  return <MenuItem {...props} />
}
function OListSubheader(props): React.ReactElement {
  return <ListSubheader {...props} />
}

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
