import React from 'react'
import { Link } from 'react-router-dom'

export default (): any => {
  return (
    <div className='menu'>
      <ul>
        <li>
          <Link to='/teams'>All Teams</Link>
        </li>
        <li>
          <Link to='/services'>All Services</Link>
        </li>
      </ul>
    </div>
  )
}
