import { Link, Outlet } from '@tanstack/react-router'
import { ShoppingBag, UserRound } from 'lucide-react'
import { useCart, useUser } from '../lib/state'
import { useRealtime } from '../lib/realtime'

export function AppShell() {
  useRealtime()
  const cart = useCart(); const user = useUser()
  const count = cart.reduce((total, item) => total + item.quantity, 0)
  return <div className="min-h-screen bg-[#080914] text-white">
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080914]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" search={{ q: '', available: 'all', sort: 'featured', page: 1 }} className="font-black tracking-[0.22em] text-white">NEXUS</Link>
        <nav aria-label="Principal" className="flex items-center gap-2">
          <Link to="/" search={{ q: '', available: 'all', sort: 'featured', page: 1 }} className="px-3 py-2 text-sm text-slate-300">Coleção</Link>
          <Link to="/cart" aria-label={`Carrinho, ${count} itens`} className="relative rounded-md p-2 text-slate-200 hover:bg-white/10"><ShoppingBag size={20}/>{count > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-violet-500 px-1 text-xs">{count}</span>}</Link>
          <Link to="/account" aria-label="Conta" className="rounded-md p-2 text-slate-200 hover:bg-white/10"><UserRound size={20}/>{user && <span className="sr-only">{user.name}</span>}</Link>
        </nav>
      </div>
    </header>
    <main><Outlet /></main>
  </div>
}
