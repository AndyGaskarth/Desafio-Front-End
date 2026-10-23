// src/types/nft.ts
export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  creator: string;
  availableQuantity: number;
}