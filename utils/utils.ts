import { LoginCredentials, LoginResponse, PriceHistoryResponse } from "@/types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";

export const API_IMAGE_PATH = process.env.NEXT_PUBLIC_BACKEND_URL + "/images";

export const API_DOCUMENT_PATH = process.env.NEXT_PUBLIC_BACKEND_URL + "/documents";

export const API_VIDEO_PATH = process.env.NEXT_PUBLIC_BACKEND_URL + "/videos";
class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse | any = await response.json();

  if (!response.ok) {
    throw new ApiError(
      "error" in data ? data.error : "Login failed",
      response.status
    );
  }

  return data as LoginResponse;
};

export const getPriceHistory = async (
  productId: string
): Promise<PriceHistoryResponse> => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/products/${productId}/price-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data: PriceHistoryResponse | ApiError = await response.json();

  if (!response.ok) {
    throw new ApiError(
      "error" in data
        ? (data.error as string)
        : "Failed to fetch price history",
      response.status
    );
  }

  return data as PriceHistoryResponse;
};
export const getCleanupStats = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cleanup/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

export const runCleanup = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/cleanup/cleanup`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cutoff_date: "2014-10-28" }),
  });
  return await response.json();
};
