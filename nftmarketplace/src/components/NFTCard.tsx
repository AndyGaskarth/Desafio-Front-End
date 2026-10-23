import type { NFT } from '../types/nft'

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111220] transition duration-300 hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-950/20">
      <div className="overflow-hidden">
        <img
          alt={nft.name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={nft.image}
        />
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
