import { ListItem, ListSubheader, makeStyles, MenuItem } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const useStyles = makeStyles(theme => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

const OListItem = (props): any => <ListItem {...props} className={mainStyles().selectable} />
// eslint-disable-next-line react/prop-types
const OMenuItem = ({ classes, ...props }): any => (
  <MenuItem {...props} classes={{ ...classes, selectable: mainStyles().selectable }} />
)
const OListSubheader = (props): any => <ListSubheader {...props} className={useStyles().listSubHeader} />

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
