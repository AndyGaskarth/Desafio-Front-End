// src/data/nfts.ts
import type { NFT } from '../types/nft'

import nftImage1 from '../assets/NFTSlaoq15H31.jpg'
import nftImage2 from '../assets/NFTSlaoq31A51.jpg'
import nftImage3 from '../assets/NFTSlaoq71G31.jpg'

export const nftsData: NFT[] = [
  {
    id: '1',
    name: 'Cosmic Creature #01',
    description: 'Uma criatura cósmica única que habita as profundezas do universo.',
    image: nftImage1,
    price: "1.5",
    creator: 'Pietro del Calle',
    availableQuantity: 10,
  },
  {
    id: '2',
    name: 'Cosmic Creature #02',
    description: 'Uma criatura cósmica única que guarda os segredos do cosmos.',
    image: nftImage2,
    price: "1.5",
    creator: 'Pietro del Calle',
    availableQuantity: 9,
  },
  {
    id: '3',
    name: 'Cosmic Creature #03',
    description: 'Uma criatura cósmica única que habita as profundezas do universo.',
    image: nftImage3,
    price: "1.5",
    creator: 'Pietro del Calle',
    availableQuantity: 3,
  }
]