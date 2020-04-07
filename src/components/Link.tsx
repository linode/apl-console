import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import { mainStyles } from '../theme'

export const Link = (props): any => <MuiLink {...props} className={mainStyles().selectable} />
export const RLink = (props): any => <RouterLink {...props} className={mainStyles().selectable} />
