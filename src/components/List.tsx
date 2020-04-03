import { ListItem } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

const MoComp = (props): any => {
  const oType = props.oType
  const Comp = props.comp
  const classes = mainStyles()
  return (
    <Comp className={classes[oType]} {...props}>
      {props.children}
    </Comp>
  )
}

export const OListItem = (props): any => <MoComp {...props} comp={ListItem} oType='selectable' />
