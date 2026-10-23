import { io, type Socket } from 'socket.io-client'

let socket: Socket | undefined
export function getSocket() {
  const socketUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;
  if (!socket) {
    socket = io(socketUrl ?? '/', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: Boolean(socketUrl),
    });
  }
  return socket
}

export function isNewer(previous: number, version: number, eventId = '') {
  if (version < previous) return false
  if (version === previous) return eventId !== '' && `nexus:${eventId}` !== sessionStorage.getItem(`seen:${version}`)
  return true
}
export function markEvent(eventId: string, version: number) { sessionStorage.setItem(`seen:${version}`, `nexus:${eventId}`) }
