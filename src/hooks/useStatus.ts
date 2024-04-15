import { useSocket, useSocketEvent } from 'socket.io-react-hook'

export default () => {
  const url = `${window.location.origin.replace(/^http/, 'ws')}`
  const path = '/api/ws'
  const { socket, error: errorSocket } = useSocket({ url, path })
  const { lastMessage: status } = useSocketEvent<any>(socket, 'status')

  return status
}
