import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { getUser, setUser } from '../lib/state'
import { login, register, saveProfile } from '../lib/api'
import type { Wallet } from '../types/contracts'

export function AccountPage() {
  const [session, setSession] = useState(getUser()); const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('demo@nexus.com'); const [password, setPassword] = useState('demo123'); const [name, setName] = useState(''); const [error, setError] = useState('')
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError('')
    try { const user = mode === 'login' ? await login(email, password) : await register(name, email, password); setUser(user); setSession(user) }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Não foi possível autenticar') }
  }
  const addWallet = async () => {
    if (!session) return
    const wallet: Wallet = { id: crypto.randomUUID(), label: 'Nova carteira', address: '0xabcdef1234567890abcdef1234567890abcdef12', network: 'Ethereum Sepolia' }
    const user = await saveProfile({ ...session, wallets: [...session.wallets, wallet] }); setUser(user); setSession(user)
  }
  if (!session) return <section className="mx-auto max-w-md px-5 py-12"><h1 className="text-3xl font-bold">Sua conta</h1><div className="mt-6 grid grid-cols-2 rounded-md bg-white/5 p-1"><button onClick={() => setMode('login')} className={`rounded-md py-2 ${mode === 'login' ? 'bg-violet-500' : ''}`}>Entrar</button><button onClick={() => setMode('register')} className={`rounded-md py-2 ${mode === 'register' ? 'bg-violet-500' : ''}`}>Cadastrar</button></div><form onSubmit={submit} className="mt-6 space-y-4">{mode === 'register' && <label className="block text-sm">Nome<input required minLength={3} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111220] px-3" /></label>}<label className="block text-sm">E-mail<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111220] px-3" /></label><label className="block text-sm">Senha<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#111220] px-3" /></label>{error && <p role="alert" className="text-sm text-red-300">{error}</p>}<button className="w-full rounded-md bg-violet-500 py-3 font-semibold">{mode === 'login' ? 'Entrar' : 'Criar conta'}</button></form><p className="mt-4 text-xs text-slate-500">Demo: demo@nexus.com / demo123</p></section>
  return <section className="mx-auto max-w-3xl px-5 py-12"><div className="flex items-center justify-between"><div><p className="text-sm text-violet-300">Perfil</p><h1 className="mt-1 text-3xl font-bold">{session.name}</h1></div><button onClick={() => { setUser(null); setSession(null) }} className="rounded-md border border-white/15 px-4 py-2">Sair</button></div><p className="mt-2 text-slate-400">{session.email}</p><section className="mt-8 rounded-lg border border-white/10 p-5"><div className="flex items-center justify-between"><h2 className="font-semibold">Carteiras</h2><button onClick={() => void addWallet()} className="rounded-md bg-violet-500 px-3 py-2 text-sm">Adicionar</button></div>{session.wallets.length === 0 && <p className="mt-4 text-sm text-slate-400">Nenhuma carteira cadastrada.</p>}<ul className="mt-4 space-y-3">{session.wallets.map((wallet) => <li key={wallet.id} className="rounded-md bg-white/5 p-3"><p>{wallet.label}</p><p className="mt-1 break-all text-xs text-slate-400">{wallet.address}</p><p className="mt-1 text-xs text-cyan-200">{wallet.network}</p></li>)}</ul></section><Link to="/checkout" className="mt-6 inline-block text-violet-300">Continuar para checkout</Link></section>
}
