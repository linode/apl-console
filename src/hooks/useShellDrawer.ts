import { useContext } from 'react'
import { ShellDrawerContext } from 'contexts/ShellDrawerContext'

// ----------------------------------------------------------------------

const useShellDrawer = () => useContext(ShellDrawerContext)

export default useShellDrawer
