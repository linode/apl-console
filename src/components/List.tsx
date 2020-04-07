import { ListItem } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const OListItem = (props): any => <ListItem {...props} className={mainStyles().selectable} />

// eslint-disable-next-line import/prefer-default-export
export { OListItem as ListItem }
