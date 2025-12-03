export interface Product {
  id: number;
  category_id: number;
  name: string;
  opt_price_min: number;
  opt_price_max: number;
  opt_unit: number;
  rozn_price_min: number;
  rozn_price_max: number;
  rozn_unit: number;
  image: string;
  changed: string;
}

// types/product.ts
export interface ProductHistory {
  id: number;
  product_id: number;
  product_name: string; 
  category_id: number;
  opt_price_min: number;
  opt_price_max: number;
  opt_unit: number;
  rozn_price_min: number;
  rozn_price_max: number;
  rozn_unit: number;
  created: string;
  cron: number;
}

// Остальные типы остаются без изменений
export interface ProductsResponse {
  products: Product[];
  count: number;
}

export interface ProductResponse {
  product: Product;
}

export interface ProductHistoryResponse {
  history: ProductHistory[];
  count: number;
}
// types/product.ts
export interface ProductHistoryFilters {
  category_id?: number;
  product_id?: number;
  date_from?: string;
  date_to?: string;
  exact_date?: string;
}

export interface PriceComparisonRequest {
  date: string;
  product_ids: number[];
}

export interface PriceComparisonResponse {
  comparison: {
    product_id: number;
    product_name: string;
    opt_price_min: number;
    opt_price_max: number;
    opt_unit: number;
    rozn_price_min: number;
    rozn_price_max: number;
    rozn_unit: number;
  }[];
}
