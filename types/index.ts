export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  login: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface PriceHistoryRecord {
  id: number;
  product_id: number;
  category_id: number;
  wholesale_price: {
    min: number;
    max: number;
    unit: number;
  };
  retail_price: {
    min: number;
    max: number;
    unit: number;
  };
  date: string;
  is_cron: boolean;
}

export interface PriceHistoryResponse {
  product_id: number;
  price_history: PriceHistoryRecord[];
  count: number;
}

export interface ApiError {
  error: string;
  details?: string;
}
