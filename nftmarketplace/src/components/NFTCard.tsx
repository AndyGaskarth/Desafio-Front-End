import { useState } from 'react'
import type { NFT } from '../types/nft'

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev)
  }

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111220] transition duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-950/20">
      {/* Container da imagem com relative para posicionar o botão */}
      <div className="relative overflow-hidden">
        <img
          alt={nft.name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={nft.image}
        />

        {/* Botão de Favoritar */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-md transition hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className={`h-5 w-5 transition-colors duration-200 ${
              isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'fill-transparent text-white/80 hover:text-white'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{nft.name}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Criado por {nft.creator}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-medium text-violet-200">
            Cósmico
          </span>
        </div>
        <p className="mt-4 min-h-12 text-sm leading-6 text-slate-400">
          {nft.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            <p className="text-xs text-slate-500">Preço</p>
            <p className="mt-1 font-semibold text-cyan-200">{nft.price} ETH</p>
          </div>
          <p className="text-right text-xs text-slate-400">
            {nft.availableQuantity} disponíveis
          </p>
        </div>
      </div>
    </article>
  )
}