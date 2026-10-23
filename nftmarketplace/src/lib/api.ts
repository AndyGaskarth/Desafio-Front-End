import axios from 'axios'
import type { CartItem, CouponResult, NFT, Order, User, Wallet } from '../types/contracts'

export const api = axios.create({ baseURL: '/api', headers: { 'Content-Type': 'application/json' } })
export const getNfts = async () => (await api.get<{ items: NFT[] }>('/nfts')).data.items
export const getNft = async (id: string) => (await api.get<NFT>(`/nfts/${id}`)).data
export const login = async (email: string, password: string) => (await api.post<{ user: User }>('/auth/login', { email, password })).data.user
export const register = async (name: string, email: string, password: string) => (await api.post<{ user: User }>('/auth/register', { name, email, password })).data.user
export const validateCoupon = async (code: string, subtotal: string) => (await api.post<CouponResult>('/coupons', { code, subtotal })).data
export const createOrder = async (payload: { items: CartItem[]; wallet: Wallet; total: string; collector: string }) => (await api.post<{ order: Order }>('/orders', payload)).data.order
export const getOrder = async (id: string) => (await api.get<{ order: Order }>(`/orders/${id}`)).data.order
export const saveProfile = async (user: User) => (await api.put<{ user: User }>('/profile', user)).data.user
