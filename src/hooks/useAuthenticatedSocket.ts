import { useCookie } from 'react-use'
import { useSocket } from 'socket.io-react-hook'
import { UseSocketOptions } from 'socket.io-react-hook/lib/cjs/types'

export default (namespace?: string, options?: UseSocketOptions<Record<string, any>>) => {
  const [accessToken] = useCookie('jwt')
  return useSocket(namespace, {
    ...options,
    enabled: !!accessToken,
  })
}
