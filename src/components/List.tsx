import { ListItem, ListSubheader, makeStyles, MenuItem } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const useStyles = makeStyles((theme) => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

const OListItem = (props): React.ReactElement => <ListItem {...props} className={mainStyles().selectable} />
// eslint-disable-next-line react/prop-types
const OMenuItem = ({ classes, ...props }): React.ReactElement => (
  <MenuItem {...props} classes={{ ...classes, selectable: mainStyles().selectable }} />
)
const OListSubheader = (props): React.ReactElement => <ListSubheader {...props} className={useStyles().listSubHeader} />

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
