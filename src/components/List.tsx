import { ListItem, ListSubheader, MenuItem, Theme } from '@mui/material'
import React from 'react'
import { makeStyles, useMainStyles } from 'common/theme'

const useStyles = makeStyles()((theme: Theme) => ({
  listSubHeader: {
    backgroundColor: theme.palette.divider,
    // a: theme.palette.primary.dark,
  },
}))

const OListItem = (props): React.ReactElement => <ListItem {...props} className={useMainStyles().classes.selectable} />
// eslint-disable-next-line react/prop-types
const OMenuItem = ({ classes, ...props }): React.ReactElement => (
  <MenuItem {...props} classes={{ ...classes, selectable: useMainStyles().classes.selectable }} />
)
const OListSubheader = (props): React.ReactElement => (
  <ListSubheader {...props} className={useStyles().classes.listSubHeader} />
)

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem, OMenuItem as MenuItem, OListSubheader as ListSubheader }
