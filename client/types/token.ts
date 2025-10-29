export interface Token {
  id?: number;
  name: string;
  symbol: string;
  description: string | null;
  mintAddress: string;
  poolAddress: string;
  website: string | null;
  twitter: string | null;
  telegram: string | null;
  imageUrl: string | null;
  metadataUrl: string | null;
  creatorAddress: string;
  bondingCurveProgress: number | null;
  volume: number | null;
  liquidity: number | null;
  marketCap: number | null;

  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface SocialLinks {
  twitter: string;
  telegram: string;
  website: string;
}

export interface TokenFormData {
  name: string;
  symbol: string;
  description: string;
  image: string;
  socialLinks: SocialLinks;
}
