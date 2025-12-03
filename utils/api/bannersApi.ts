import { Banner, BannerHistory } from "@/types/banners";

// services/banners.ts
import { API_BASE_URL } from "../utils";

export interface BannerData {
  group_id: number;
  text: string;
  image?: File;
}

export const getBanners = async (
  group_id: number,
  results: "active" | "all" = "active"
): Promise<{ banners: Banner[]; count: number }> => {
  const token = localStorage.getItem("token");
  // console.log(group_id);
  const response = await fetch(
    `${API_BASE_URL}/banners?group_id=${group_id}&results=${results}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
};

export const getBanner = async (id: number): Promise<{ banner: Banner }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

// В utils/api/bannersApi
export const createBanner = async (data: {
  group_id: number;
  text: string;
  image: File;
  sort?: number;
}): Promise<{ message: string; banner: Banner }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("group_id", data.group_id.toString());
  formData.append("text", data.text);
  formData.append("sort", (data.sort || 0).toString());
  formData.append("image", data.image);

  const response = await fetch(`${API_BASE_URL}/banners`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create banner");
  }

  return await response.json();
};
// В utils/api/bannersApi
export const updateBanner = async (
  id: number,
  data: {
    group_id: number;
    text: string;
    sort?: number;
    image?: File;
  }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("group_id", data.group_id.toString());
  formData.append("text", data.text);
  formData.append("sort", (data.sort || 0).toString()); // Добавляем sort

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update banner");
  }

  return await response.json();
};
export const deleteBanner = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const getBannerHistory = async (
  id: number
): Promise<{ history: BannerHistory[] }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/banners/${id}/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};
