import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { getNfts, validateCoupon } from '../lib/api'
import { getCart, setCart } from '../lib/state'
import { money, multiply, subtract, sum } from '../lib/money'

export function CartPage() {
  const navigate = useNavigate(); const cart = getCart(); const [coupon, setCoupon] = useState(''); const [couponMessage, setCouponMessage] = useState('')
  const { data = [] } = useQuery({ queryKey: ['nfts'], queryFn: getNfts })
  const lines = cart.map((item) => ({ ...item, nft: data.find((nft) => nft.id === item.nftId) })).filter((item) => item.nft)
  const subtotal = sum(lines.map((line) => multiply(line.nft!.price, line.quantity)))
  const fee = lines.length ? multiply(subtotal, 0.025).slice(0) : '0'
  const applyCoupon = async () => { const result = await validateCoupon(coupon, subtotal); setCouponMessage(result.message); if (result.valid) sessionStorage.setItem('nexus-coupon', coupon.toUpperCase()) }
  const discount = sessionStorage.getItem('nexus-coupon') === 'NEXUS10' ? multiply(subtotal, 0.1) : '0'
  const total = subtract(sum([subtotal, fee]), discount)
  const updateQuantity = (id: string, quantity: number) => setCart(
    quantity < 1
      ? cart.filter((item) => item.nftId !== id)
      : cart.map((item) => item.nftId === id ? { ...item, quantity } : item),
  )

  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      <h1 className="text-3xl font-bold">Seu carrinho</h1>
      {lines.length === 0 ? (
        <div className="mt-8 rounded-lg border border-white/10 p-10 text-center">
          <p className="text-slate-300">Seu carrinho está vazio.</p>
          <Link to="/" search={{ q: '', available: 'all', sort: 'featured', page: 1 }} className="mt-4 inline-block text-violet-300">Explorar coleção</Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">
          <div className="space-y-4">
            {lines.map((line) => (
              <article key={line.nftId} className="flex gap-4 rounded-lg border border-white/10 bg-[#111220] p-4">
                <img src={line.nft!.image} alt="" className="h-24 w-24 rounded-md object-cover" />
                <div className="flex-1">
                  <h2 className="font-semibold">{line.nft!.name}</h2>
                  <p className="mt-1 text-sm text-cyan-200">{money(line.nft!.price)}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>Qtd.</span>
                      <button type="button" aria-label={`Diminuir quantidade de ${line.nft!.name}`} onClick={() => updateQuantity(line.nftId, Math.max(1, line.quantity - 1))} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-base text-white transition hover:border-violet-400 hover:bg-violet-400/10 active:scale-95">−</button>
                      <output className="grid h-8 min-w-10 place-items-center rounded-md border border-white/10 bg-[#090a14] px-2 text-sm font-semibold text-white tabular-nums">{line.quantity}</output>
                      <button type="button" aria-label={`Aumentar quantidade de ${line.nft!.name}`} disabled={line.quantity >= line.nft!.availableQuantity} onClick={() => updateQuantity(line.nftId, line.quantity + 1)} className="grid h-8 w-8 place-items-center rounded-md border border-white/10 text-base text-white transition hover:border-violet-400 hover:bg-violet-400/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40">+</button>
                    </div>
                    <button aria-label={`Remover ${line.nft!.name}`} onClick={() => updateQuantity(line.nftId, 0)} className="ml-auto p-2 text-slate-400"><Trash2 size={18} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-white/10 bg-[#111220] p-5">
            <h2 className="font-semibold">Resumo</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><dt className="text-slate-400">Subtotal</dt><dd>{money(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Desconto</dt><dd>-{money(discount)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-400">Taxas</dt><dd>{money(fee)}</dd></div>
              <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-semibold"><dt>Total</dt><dd>{money(total)}</dd></div>
            </dl>
            <label className="mt-6 block text-sm" htmlFor="coupon">Cupom</label>
            <form className="mt-2 flex" onSubmit={(event) => { event.preventDefault(); void applyCoupon() }}>
              <input id="coupon" value={coupon} onChange={(event) => setCoupon(event.target.value)} className="min-w-0 flex-1 rounded-l-md border border-white/10 bg-[#090a14] px-3" placeholder="Digite o cupom" />
              <button type="submit" className="cursor-pointer rounded-r-md bg-violet-500 px-3 text-sm transition duration-200 hover:bg-violet-400 active:scale-95">Aplicar</button>
            </form>
            <p role="status" className="mt-2 text-xs text-slate-400">{couponMessage}</p>
            <button disabled={lines.some((line) => line.quantity > line.nft!.availableQuantity)} onClick={() => navigate({ to: '/checkout' })} className="mt-6 w-full rounded-md bg-violet-500 py-3 font-semibold transition duration-200 hover:bg-violet-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">Ir para checkout</button>
          </aside>
        </div>
      )}
    </section>
  )
}
