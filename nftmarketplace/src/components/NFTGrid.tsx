import { NFTCard } from './NFTCard'
import { nftsData } from '../data/nfts'

export function NFTGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {nftsData.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  )
}