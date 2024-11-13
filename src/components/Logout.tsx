import { useEffect } from 'react'

function Logout() {
  useEffect(() => {
    window.location.href = '/logout-otomi'
  }, [])

  return null
}

export default Logout
