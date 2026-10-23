import { NFTCard } from './NFTCard'
import type { NFT } from '../types/nft'

interface NFTGridProps {
  nfts: NFT[]
}

export function NFTGrid({ nfts }: NFTGridProps) {
  if (nfts.length === 0) {
    return <p className="text-center text-slate-400">Nenhum NFT encontrado.</p>
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}