import React, { useEffect } from 'react'
import { useSession } from 'providers/Session'
import useSettings from 'hooks/useSettings'

/**
 * Initializes theme view based on user role.
 * Non-platform admin users are automatically set to 'team' view.
 */
export default function ThemeViewInitializer() {
  const { user } = useSession()
  const { onChangeView } = useSettings()

  useEffect(() => {
    const { isPlatformAdmin } = user
    if (!isPlatformAdmin) onChangeView({ target: { value: 'team' } } as React.ChangeEvent<HTMLInputElement>)
  }, []) // Empty dependency array - run once on mount

  return null // This component doesn't render anything
}
