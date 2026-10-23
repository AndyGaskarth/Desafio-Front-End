import { io, type Socket } from 'socket.io-client'

let socket: Socket | undefined
export function getSocket() {
  if (!socket) socket = io({ path: '/socket.io', transports: ['websocket', 'polling'] })
  return socket
}

export function isNewer(previous: number, version: number, eventId = '') {
  if (version < previous) return false
  if (version === previous) return eventId !== '' && `nexus:${eventId}` !== sessionStorage.getItem(`seen:${version}`)
  return true
}
export function markEvent(eventId: string, version: number) { sessionStorage.setItem(`seen:${version}`, `nexus:${eventId}`) }
