import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { getNfts } from '../lib/api'
import { money } from '../lib/money'

export function CataloguePage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { q?: string; available?: string; sort?: string; page?: number }
  const { data = [], isPending, isError } = useQuery({ queryKey: ['nfts'], queryFn: getNfts })
  const query = search.q ?? ''; const available = search.available ?? 'all'; const sort = search.sort ?? 'featured'; const page = search.page ?? 1
  let filtered = data.filter((item) => `${item.name} ${item.creator}`.toLowerCase().includes(query.toLowerCase()) && (available === 'all' || item.availableQuantity > 0))
  filtered = [...filtered].sort((a, b) => sort === 'price-asc' ? Number(a.price) - Number(b.price) : sort === 'name' ? a.name.localeCompare(b.name) : 0)
  const perPage = 6; const pages = Math.max(1, Math.ceil(filtered.length / perPage)); const items = filtered.slice((page - 1) * perPage, page * perPage)
  const update = (values: Record<string, string | number>) => navigate({ to: '/', search: { q: query, available, sort, page: 1, ...values } })
  return <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">A coleção</p>
    <h1 className="mt-2 text-3xl font-bold sm:text-5xl">Encontre sua criatura cósmica</h1>
    <div className="mt-8 grid gap-3 rounded-lg border border-white/10 bg-[#111220] p-4 md:grid-cols-[1fr_180px_180px]">
      <label className="relative"><span className="sr-only">Buscar por nome ou criador</span><Search className="absolute left-3 top-3 text-slate-500" size={18}/><input value={query} onChange={(event) => update({ q: event.target.value })} className="h-11 w-full rounded-md border border-white/10 bg-[#090a14] pl-10 pr-3 outline-none focus:border-violet-400" placeholder="Nome ou criador"/></label>
      <select aria-label="Disponibilidade" value={available} onChange={(event) => update({ available: event.target.value })} className="h-11 rounded-md border border-white/10 bg-[#090a14] px-3"><option value="all">Todos</option><option value="available">Disponíveis</option></select>
      <select aria-label="Ordenação" value={sort} onChange={(event) => update({ sort: event.target.value })} className="h-11 rounded-md border border-white/10 bg-[#090a14] px-3"><option value="featured">Em destaque</option><option value="price-asc">Menor preço</option><option value="name">Nome</option></select>
    </div>
    {isPending && <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((key) => <div key={key} className="h-96 animate-pulse rounded-lg bg-white/5" />)}</div>}
    {isError && <p className="mt-8 rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-red-200">Não foi possível carregar os NFTs.</p>}
    {!isPending && !isError && items.length === 0 && <p className="mt-10 text-center text-slate-400">Nenhum NFT encontrado.</p>}
    {!isPending && <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <Link to="/nft/$id" params={{ id: item.id }} key={item.id} className="group overflow-hidden rounded-lg border border-white/10 bg-[#111220] focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-400"><img src={item.image} alt="" className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.02]"/><div className="p-5"><h2 className="text-lg font-semibold">{item.name}</h2><p className="mt-1 text-sm text-slate-400">por {item.creator}</p><div className="mt-4 flex justify-between border-t border-white/10 pt-4"><span className="text-xs text-slate-500">Preço</span><strong className="text-cyan-200">{money(item.price)}</strong></div></div></Link>)}</div>}
    <div className="mt-8 flex justify-center gap-2" aria-label="Paginação">{Array.from({ length: pages }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => update({ page: number })} aria-current={page === number ? 'page' : undefined} className={`h-10 w-10 rounded-md border ${page === number ? 'border-violet-400 bg-violet-500' : 'border-white/10'}`}>{number}</button>)}</div>
  </section>
}
