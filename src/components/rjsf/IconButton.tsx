import { Add, ArrowDownward, ArrowUpward, Remove } from '@mui/icons-material'
import { Button, ButtonProps } from '@mui/material'
import React from 'react'

const mappings: any = {
  remove: Remove,
  plus: Add,
  'arrow-up': ArrowUpward,
  'arrow-down': ArrowDownward,
}

type IconButtonProps = ButtonProps & {
  icon: string
  iconProps?: any
  href?: any
}

function IconButton(props: IconButtonProps) {
  const { icon, iconProps, ...otherProps } = props
  const IconComp = mappings[icon]
  return (
    <Button {...otherProps} size='small'>
      <IconComp {...iconProps} />
    </Button>
  )
}

export default IconButton
