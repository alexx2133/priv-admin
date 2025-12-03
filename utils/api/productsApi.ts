import { Product } from "@/types/products";
import { API_BASE_URL } from "../utils";


export interface ProductData {
  category_id: number;
  name: string;
  opt_price_min: number;
  opt_price_max: number;
  opt_unit: number;
  rozn_price_min: number;
  rozn_price_max: number;
  rozn_unit: number;
  image?: File;
}

export const getProducts = async (): Promise<{
  products: Product[];
  count: number;
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
};

export const getProduct = async (id: number): Promise<{ product: Product }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch product");
  return await response.json();
};

export const createProduct = async (
  data: ProductData
): Promise<{ message: string; product: Product }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("category_id", data.category_id.toString());
  formData.append("name", data.name);
  formData.append("opt_price_min", data.opt_price_min.toString());
  formData.append("opt_price_max", data.opt_price_max.toString());
  formData.append("opt_unit", data.opt_unit.toString());
  formData.append("rozn_price_min", data.rozn_price_min.toString());
  formData.append("rozn_price_max", data.rozn_price_max.toString());
  formData.append("rozn_unit", data.rozn_unit.toString());
  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to create product");
  return await response.json();
};

export const updateProduct = async (
  id: number,
  data: Partial<ProductData>
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  if (data.category_id)
    formData.append("category_id", data.category_id.toString());
  if (data.name) formData.append("name", data.name);
  if (data.opt_price_min)
    formData.append("opt_price_min", data.opt_price_min.toString());
  if (data.opt_price_max)
    formData.append("opt_price_max", data.opt_price_max.toString());
  if (data.opt_unit) formData.append("opt_unit", data.opt_unit.toString());
  if (data.rozn_price_min)
    formData.append("rozn_price_min", data.rozn_price_min.toString());
  if (data.rozn_price_max)
    formData.append("rozn_price_max", data.rozn_price_max.toString());
  if (data.rozn_unit) formData.append("rozn_unit", data.rozn_unit.toString());
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to update product");
  return await response.json();
};

export const deleteProduct = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to delete product");
  return await response.json();
};
