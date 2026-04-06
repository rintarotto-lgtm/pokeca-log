export interface Article {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail: string;
  popular?: boolean;
  packSlug?: string;
}

export interface ArticleWithContent extends Article {
  content: string;
}

export interface PriceEntry {
  shop: string;
  price: number | null;
  url: string;
  updatedAt: string;
}

export interface CardPrice {
  cardId: string;
  cardName: string;
  cardNumber: string;
  packName: string;
  packSlug: string;
  rarity: string;
  imageUrl: string;
  prices: PriceEntry[];
}

export interface Pack {
  slug: string;
  name: string;
  releaseDate: string;
  imageUrl: string;
  description: string;
}
