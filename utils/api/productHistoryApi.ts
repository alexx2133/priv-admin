import { PriceComparisonResponse, ProductHistory } from "@/types/products";
import { API_BASE_URL } from "../utils";

// Получить последние записи всех товаров
export const getLatestProductHistory = async (): Promise<{
  history: ProductHistory[];
  count: number;
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products-history/latest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch latest product history");
  return await response.json();
};

// Получить последние записи по категории
export const getCategoryProductHistory = async (
  categoryId: number
): Promise<{ history: ProductHistory[]; count: number }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/products-history/category/${categoryId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch category product history");
  return await response.json();
};

// Получить историю конкретного товара, можно указать дату
export const getProductHistoryByProduct = async (
  productId: number,
  exact_date?: string
): Promise<{ history: ProductHistory[]; count: number }> => {
  const token = localStorage.getItem("token");
  const url = new URL(`${API_BASE_URL}/products-history/product/${productId}`);
  if (exact_date) url.searchParams.append("exact_date", exact_date);

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok)
    throw new Error("Failed to fetch product history by product");
  return await response.json();
};

// Новый роут: история по дате, с опциональной категорией
export const getProductHistoryByDate = async (
  exact_date: string,
  categoryId?: number
): Promise<{ history: ProductHistory[]; count: number }> => {
  const token = localStorage.getItem("token");
  const url = new URL(`${API_BASE_URL}/products-history/date`);
  url.searchParams.append("exact_date", exact_date);
  if (categoryId) url.searchParams.append("category_id", categoryId.toString());

  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch product history by date");
  return await response.json();
};

// Обновление записи истории товара
export const updateProductHistory = async (
  id: number,
  data: {
    opt_price_min: number;
    opt_price_max: number;
    opt_unit: number;
    rozn_price_min: number;
    rozn_price_max: number;
    rozn_unit: number;
  }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products-history/byid/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update product history");
  return await response.json();
};

// Сравнение цен по дате для массива товаров
export const comparePrices = async (data: {
  date: string;
  product_ids: number[];
}): Promise<PriceComparisonResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products-history/compare`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to compare prices");
  return await response.json();
};
// Получить конкретную запись истории по ID
export const getProductHistoryById = async (
  id: number
): Promise<{ history: ProductHistory }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products-history/byid/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch product history by ID");
  return await response.json();
};
