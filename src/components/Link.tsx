import React from 'react'
import { Link } from 'react-router-dom'
import { mainStyles } from '../theme'

export default (props): any => <Link {...props} className={mainStyles().selectable} />
