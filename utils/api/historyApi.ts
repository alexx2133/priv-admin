import { HistoriesResponse, History, HistoryResponse } from "@/types/category";
import { API_BASE_URL } from "../utils";

export const createHistory = async (
  data: History
): Promise<HistoryResponse> => {
  const token = localStorage.getItem("token");
  console.log(data);
  const response = await fetch(`${API_BASE_URL}/history`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // Не устанавливаем Content-Type - браузер сам установит с boundary для FormData
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
export const getHistory = async (): Promise<HistoriesResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
export const updateHistory = async (
  id: number,
  data: History
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json", // ← Добавьте это
    },
    body: JSON.stringify(data), // ← Преобразуйте в JSON
  });
  return await response.json();
};
export const deleteHistory = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
export const getHistoryById = async (id: number): Promise<HistoryResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/history/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
