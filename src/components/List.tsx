import { ListItem, ListSubheader, MenuItem } from '@mui/material'
import React from 'react'
import { useMainStyles } from 'common/theme'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

function OListItem(props): React.ReactElement {
  return <ListItem {...props} className={useMainStyles().classes.selectable} />
}
// eslint-disable-next-line react/prop-types
function OMenuItem({ classes, ...props }): React.ReactElement {
  return <MenuItem {...props} classes={{ ...classes, selectable: useMainStyles().classes.selectable }} />
}
function OListSubheader(props): React.ReactElement {
  return <ListSubheader {...props} className={useStyles().classes.listSubHeader} />
}

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
