import { SettingsResponse } from "@/types/settings";
import { API_BASE_URL } from "../utils";


export const getSettingsByGroup = async (
  group: string
): Promise<SettingsResponse> => {
  console.log(group);
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings/group/${group}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const updateSetting = async (
  id: number,
  data: string
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  return await response.json();
};

export const updateMultipleSettings = async (
  settings: { id: number; data: string }[]
): Promise<{ message: string }> => {
  console.log(settings);
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  return await response.json();
};
export const updateSettingImage = async (
  id: number,
  formData: FormData
): Promise<{ message: string; filename: string; filePath: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/settings/upload/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};
