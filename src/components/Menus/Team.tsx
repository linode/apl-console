import React from 'react'
import { Link } from 'react-router-dom'

export default ({ teamName }): any => {
  return (
    <div className='menu'>
      <ul>
        <li>
          <Link to={`/teams/${teamName}`}>Team Details</Link>
        </li>
        <li>
          <Link to={`/teams/${teamName}/services`}>Team Services</Link>
        </li>
      </ul>
    </div>
  )
}
