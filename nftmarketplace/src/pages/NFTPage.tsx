import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from '@tanstack/react-router'
import { Heart, Minus, Plus } from 'lucide-react'
import { getNft } from '../lib/api'
import { addToCart, storage } from '../lib/state'
import { money } from '../lib/money'

export function NFTPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const { data, isPending, isError } = useQuery({ queryKey: ['nft', id], queryFn: () => getNft(id) })
  const [quantity, setQuantity] = useState(1); const [notice, setNotice] = useState(''); const favorites = storage.read<string[]>('nexus-favorites', [])
  if (isPending) return <div className="mx-auto h-96 max-w-7xl animate-pulse bg-white/5" />
  if (isError || !data) return <section className="mx-auto max-w-7xl px-5 py-16"><h1 className="text-3xl font-bold">NFT não encontrado</h1><Link to="/" search={{ q: '', available: 'all', sort: 'featured', page: 1 }} className="mt-4 inline-block text-violet-300">Voltar ao catálogo</Link></section>
  const favorite = favorites.includes(data.id)
  const toggleFavorite = () => storage.write('nexus-favorites', favorite ? favorites.filter((value) => value !== data.id) : [...favorites, data.id])
  return <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-2 sm:px-8"><div><img src={data.image} alt={data.name} className="aspect-square w-full rounded-lg object-cover"/></div><div><p className="text-sm text-violet-300">{data.creator}</p><h1 className="mt-2 text-4xl font-bold">{data.name}</h1><p className="mt-5 leading-7 text-slate-300">{data.description}</p><p className="mt-8 text-3xl font-semibold text-cyan-200">{money(data.price)}</p>{data.availableQuantity === 0 ? <p className="mt-5 rounded-md border border-red-400/30 p-4 text-red-200">Este NFT está esgotado.</p> : <><div className="mt-8 flex items-center gap-3"><span className="text-sm text-slate-400">Quantidade</span><button aria-label="Diminuir quantidade" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-10 w-10 rounded-md border border-white/10 transition hover:border-violet-400 hover:bg-violet-400/10 active:scale-95"><Minus size={16} className="mx-auto"/></button><output className="grid h-10 w-12 place-items-center rounded-md border border-white/10 bg-white/[0.03] font-semibold tabular-nums">{quantity}</output><button aria-label="Aumentar quantidade" disabled={quantity >= data.availableQuantity} onClick={() => setQuantity((value) => value + 1)} className="h-10 w-10 rounded-md border border-white/10 transition hover:border-violet-400 hover:bg-violet-400/10 active:scale-95 disabled:cursor-not-allowed"><Plus size={16} className="mx-auto"/></button></div><div className="mt-6 flex gap-3"><button onClick={() => { addToCart(data.id, quantity); setNotice('Adicionado ao carrinho.') }} className="flex-1 rounded-md bg-violet-500 px-5 py-3 font-semibold transition duration-200 hover:bg-violet-400 hover:shadow-lg hover:shadow-violet-950/30 active:scale-[0.98]">Adicionar ao carrinho</button><button aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'} aria-pressed={favorite} onClick={toggleFavorite} className="grid h-12 w-12 place-items-center rounded-md border border-white/15 transition hover:border-violet-400 hover:bg-violet-400/10 hover:text-violet-300 active:scale-95"><Heart fill={favorite ? 'currentColor' : 'none'}/></button></div></>}<p role="status" className="mt-4 text-cyan-200">{notice}</p></div></section>
}
