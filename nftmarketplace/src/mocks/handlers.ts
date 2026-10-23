import { http, HttpResponse } from 'msw'
import { nftsData } from '../data/nfts'
import type { NFT, Order, User } from '../types/contracts'

const nft = (id: string): NFT => ({ ...nftsData.find((item) => item.id === id)!, edition: 'Genesis', version: 1 })
nftsData.forEach((item) => Object.assign(item, { edition: 'Genesis', version: 1 }))

let users: User[] = [{
  id: 'demo-user', name: 'Colecionador Demo', email: 'demo@nexus.com',
  wallets: [{ id: 'wallet-1', label: 'Carteira principal', address: '0x1234567890abcdef1234567890abcdef12345678', network: 'Ethereum Sepolia' }],
}]
const orders = new Map<string, Order>()

export const handlers = [
  http.get('/api/nfts', () => HttpResponse.json({ items: nftsData.map((item) => nft(item.id)) })),
  http.get('/api/nfts/:id', ({ params }) => {
    const found = nftsData.find((item) => item.id === params.id)
    return found ? HttpResponse.json(nft(found.id)) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    const user = users.find((item) => item.email.toLowerCase() === body.email.toLowerCase())
    return user && body.password.length >= 6 ? HttpResponse.json({ user }) : HttpResponse.json({ message: 'Credenciais inválidas' }, { status: 401 })
  }),
  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string }
    if (body.password.length < 6 || users.some((item) => item.email === body.email)) return HttpResponse.json({ message: 'Dados inválidos ou e-mail já cadastrado' }, { status: 400 })
    const user: User = { id: crypto.randomUUID(), name: body.name, email: body.email, wallets: [] }
    users.push(user)
    return HttpResponse.json({ user }, { status: 201 })
  }),
  http.post('/api/coupons', async ({ request }) => {
    const { code } = await request.json() as { code: string }
    if (code.toUpperCase() === 'NEXUS10') return HttpResponse.json({ valid: true, kind: 'valid', discount: '0.10', message: '10% de desconto aplicado' })
    if (code.toUpperCase() === 'EXPIRED') return HttpResponse.json({ valid: false, kind: 'expired', discount: '0', message: 'Cupom expirado' })
    return HttpResponse.json({ valid: false, kind: 'invalid', discount: '0', message: 'Cupom inválido' })
  }),
  http.post('/api/orders', async ({ request }) => {
    const payload = await request.json() as Omit<Order, 'id' | 'status' | 'createdAt' | 'version'> & { collector: string }
    const id = `NX-${String(Date.now()).slice(-6)}`
    const order: Order = { ...payload, id, status: 'pending', createdAt: new Date().toISOString(), version: 1 }
    orders.set(id, order)
    window.setTimeout(() => { const confirmed = { ...order, status: 'confirmed' as const, version: 2 }; orders.set(id, confirmed) }, 800)
    return HttpResponse.json({ order }, { status: 201 })
  }),
  http.get('/api/orders/:id', ({ params }) => {
    const order = orders.get(String(params.id))
    return order ? HttpResponse.json({ order }) : new HttpResponse(null, { status: 404 })
  }),
  http.put('/api/profile', async ({ request }) => {
    const user = await request.json() as User
    users = users.map((item) => item.id === user.id ? user : item)
    return HttpResponse.json({ user })
  }),
  http.post('/api/reset', () => { users = users.slice(0, 1); orders.clear(); return HttpResponse.json({ ok: true }) }),
]
