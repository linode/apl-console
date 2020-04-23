import { Link } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

export default (props): any => <Link {...props} className={mainStyles().selectable} />
