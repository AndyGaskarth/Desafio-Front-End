import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSocket, isNewer, markEvent } from './socket'

interface NftUpdate { id: string; price?: string; availableQuantity?: number; version: number; eventId: string }
interface OrderUpdate { id: string; status: 'pending' | 'confirmed' | 'declined'; version: number; eventId: string }

export function useRealtime() {
  const queryClient = useQueryClient()
  useEffect(() => {
    const socket = getSocket()
    const nftHandler = (event: NftUpdate) => {
      const versions = JSON.parse(sessionStorage.getItem('nexus-versions') ?? '{}') as Record<string, number>
      if (!isNewer(versions[`nft:${event.id}`] ?? 0, event.version, event.eventId)) return
      versions[`nft:${event.id}`] = event.version; sessionStorage.setItem('nexus-versions', JSON.stringify(versions)); markEvent(event.eventId, event.version)
      queryClient.invalidateQueries({ queryKey: ['nfts'] }); queryClient.invalidateQueries({ queryKey: ['nft', event.id] })
    }
    const orderHandler = (event: OrderUpdate) => {
      const versions = JSON.parse(sessionStorage.getItem('nexus-versions') ?? '{}') as Record<string, number>
      if (!isNewer(versions[`order:${event.id}`] ?? 0, event.version, event.eventId)) return
      versions[`order:${event.id}`] = event.version; sessionStorage.setItem('nexus-versions', JSON.stringify(versions)); markEvent(event.eventId, event.version)
      queryClient.invalidateQueries({ queryKey: ['order', event.id] })
      window.dispatchEvent(new CustomEvent('nexus-order-update', { detail: event }))
    }
    socket.on('nft.updated', nftHandler); socket.on('order.updated', orderHandler)
    socket.on('connect', () => queryClient.invalidateQueries())
    return () => { socket.off('nft.updated', nftHandler); socket.off('order.updated', orderHandler) }
  }, [queryClient])
}
