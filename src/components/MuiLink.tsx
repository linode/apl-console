import { Link } from '@material-ui/core'
import React from 'react'
import { mainStyles } from '../theme'

export default (props): React.ReactElement => <Link {...props} className={mainStyles().selectable} />
