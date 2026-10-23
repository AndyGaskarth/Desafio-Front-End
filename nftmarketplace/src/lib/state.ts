import { useSyncExternalStore } from 'react'
import type { CartItem, User } from '../types/contracts'

export const storage = {
  read<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback } catch { return fallback } },
  write<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event('nexus-storage')) },
}

let cartSnapshot = storage.read<CartItem[]>('nexus-cart', [])
let userSnapshot = storage.read<User | null>('nexus-user', null)
export const getCart = () => cartSnapshot
export const setCart = (cart: CartItem[]) => { cartSnapshot = cart; storage.write('nexus-cart', cart) }
export const getUser = () => userSnapshot
export const setUser = (user: User | null) => { userSnapshot = user; storage.write('nexus-user', user) }
export const useCart = () => useSyncExternalStore((notify) => { window.addEventListener('nexus-storage', notify); return () => window.removeEventListener('nexus-storage', notify) }, getCart)
export const useUser = () => useSyncExternalStore((notify) => { window.addEventListener('nexus-storage', notify); return () => window.removeEventListener('nexus-storage', notify) }, getUser)

export function addToCart(nftId: string, quantity: number) {
  const cart = getCart(); const found = cart.find((item) => item.nftId === nftId)
  setCart(found ? cart.map((item) => item.nftId === nftId ? { ...item, quantity: item.quantity + quantity } : item) : [...cart, { nftId, quantity }])
}
