import {
  Category,
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryData,
  UpdateCategoryData,
  HistoryResponse,
} from "@/types/category";
import { API_BASE_URL } from "../utils";
import { SettingsResponse } from "@/types/settings";

export const getCategories = async (): Promise<CategoriesResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const createCategory = async (
  formData: FormData
): Promise<CategoryResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // Не устанавливаем Content-Type - браузер сам установит с boundary для FormData
    },
    body: formData,
  });
  return await response.json();
};

export const updateCategory = async (
  id: number,
  formData: FormData
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};

export const deleteCategory = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
export const getCategoryById = async (
  id: number
): Promise<CategoryResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
