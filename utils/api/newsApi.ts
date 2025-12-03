import { News } from "@/types/news";
import { API_BASE_URL } from "../utils";

export const getNews = async (): Promise<{ news: News[]; count: number }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/news`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news");
  }

  return await response.json();
};

export const getNewsById = async (id: number): Promise<{ news: News }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch news item");
  }

  return await response.json();
};

export const createNews = async (data: {
  title: string;
  text: string;
  image: File;
  date: string;
}): Promise<{ message: string; news: News }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("text", data.text);
  formData.append("date", data.date);
  formData.append("image", data.image);

  const response = await fetch(`${API_BASE_URL}/news`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create news");
  }

  return await response.json();
};

export const updateNews = async (
  id: number,
  data: {
    title?: string;
    text?: string;
    date?: string;
    image?: File;
  }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.text) formData.append("text", data.text);
  if (data.date) formData.append("date", data.date);
  if (data.image) formData.append("image", data.image);

  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update news");
  }

  return await response.json();
};

export const deleteNews = async (id: number): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/news/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete news");
  }

  return await response.json();
};
