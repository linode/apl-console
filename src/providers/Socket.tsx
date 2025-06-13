import React, { createContext, useContext, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'

type Statuses = Record<string, any>

type SocketContextType = {
  socket: Socket | null
  statuses: Statuses
}

const SocketContext = createContext<SocketContextType>({ socket: null, statuses: {} })

export const useSocket = () => useContext(SocketContext)

export default function SocketProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [statuses, setStatuses] = useState<Statuses>({})
  const socketServerUrl = `${window.location.origin.replace(/^http/, 'ws')}`

  useEffect(() => {
    const socketInstance = io(socketServerUrl, {
      path: '/api/ws',
    })
    setSocket(socketInstance)

    // Listen for status updates from the server
    socketInstance.on('status', (data) => {
      setStatuses((prev) => ({ ...prev, ...data }))
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  const contextValue = React.useMemo(() => ({ socket, statuses }), [socket, statuses])
  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>
}
