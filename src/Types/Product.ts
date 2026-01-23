// src/Types/Product.ts  (GÜNCEL)
export type OptionRow = {
  id: string;
  title: string;
  description: string | null;
  type: "addon" | "subscription";
  is_required: number;
  is_recurring: number;
  price_amount: number;
  currency: string;
  billing_period: string | null;
  price_label: string | null;
  sort_order: number;
};

export type ProductOption = {
  id: string;
  title: string;
  description?: string | null;
  type: "addon" | "subscription";
  isRequired: boolean;
  isRecurring: boolean;
  priceAmount: number;
  currency: string;
  billingPeriod?: string | null;
  priceLabel?: string | null;
  sort?: number;
};

export type Product = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  badge?: string | null;
  href?: string | null;
  category: string;
  categoryTitle?: string | null;
  price?: string | null;
  locale: string;
  created_at?: string;
  updated_at?: string;
  options?: ProductOption[];
};

export type ProductCategory = { id: string; label: string; icon?: string };

export type ProductFeature = { type?: "premium" | string; label: string };

/* API */
export interface ApiProductResponse {
  ok: true;
  item: Product;
}
export interface ApiProductsResponse {
  ok: true;
  items: Product[];
  nextCursor?: number | null;
  hasMore?: boolean;
}
export interface ApiErrorResponse {
  ok: false;
  error: string | Record<string, any>;
}
export type ApiResponse = ApiProductResponse | ApiErrorResponse;
export type ApiListResponse = ApiProductsResponse | ApiErrorResponse;

/* UI ekstra tipi (legacy + API) */
export type UIExtra = {
  id: string;
  title: string;
  description?: string | null;
  type?: "addon" | "subscription";
  price?: string | null;
  priceAmount?: number | null;
  priceLabel?: string | null;
};

/* Legacy ürün özeti */
export type LegacyProduct = {
  id: string;
  priceAmount?: number;
  pricingType?: "free" | "paid";
  features?: ProductFeature[];
  extras?: UIExtra[];
};

/* Yükleme durumları */
export interface LoadingState {
  loading: boolean;
  error: string | null;
  product: Product | null;
}
export interface ProductsLoadingState {
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  products: Product[];
  nextCursor: number | null;
  hasMore: boolean;
}

/* Ortak küçük bileşen prop tipleri */
export type ButtonVariant = "primary" | "outline";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonProps = {
  children: any;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};
