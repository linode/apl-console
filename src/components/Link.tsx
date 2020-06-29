import React from 'react'
import { Link } from 'react-router-dom'
import { mainStyles } from '../theme'

export default (props: any): any => { 
    const {children} = props
    return (<Link {...props} className={mainStyles().selectable} data-cy={`link-${children}`} />)
}
