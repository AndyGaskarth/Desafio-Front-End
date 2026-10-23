export interface NFT {
  id: string
  name: string
  description: string
  creator: string
  image: string
  price: string
  availableQuantity: number
  edition: string
  version: number
}

export interface CartItem { nftId: string; quantity: number }
export interface Wallet { id: string; label: string; address: string; network: string }
export interface User { id: string; name: string; email: string; avatar?: string; wallets: Wallet[] }
export interface Order { id: string; status: 'pending' | 'confirmed' | 'declined'; items: CartItem[]; total: string; createdAt: string; version: number }
export interface CouponResult { valid: boolean; kind: 'valid' | 'invalid' | 'expired'; discount: string; message: string }
