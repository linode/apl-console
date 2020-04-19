import { ListItem, ListSubheader, MenuItem, makeStyles } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const useStyles = makeStyles(theme => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

const OListItem = (props): any => <ListItem {...props} className={mainStyles().selectable} />
const OMenuItem = (props): any => <MenuItem {...props} className={mainStyles().selectable} />
const OListSubheader = (props): any => <ListSubheader {...props} className={useStyles().listSubHeader} />

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
