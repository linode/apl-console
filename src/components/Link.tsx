import React from 'react'
import { Link } from 'react-router-dom'
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

export const OLink = (props): any => <MoComp {...props} comp={Link} oType='selectable' />
