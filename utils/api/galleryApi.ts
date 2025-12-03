import { Photo, PhotoAlbum, Video, VideoAlbum } from "@/types/gallery";
import { API_BASE_URL } from "../utils";

// utils/api/galleryApi.ts

// Фотоальбомы
export const getPhotoAlbums = async (): Promise<{
  albums: PhotoAlbum[];
  count: number;
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/albums`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch photo albums");
  return await response.json();
};

export const createPhotoAlbum = async (data: {
  name: string;
  sort?: number;
}): Promise<{ message: string; album: PhotoAlbum }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/albums`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create photo album");
  return await response.json();
};

export const updatePhotoAlbum = async (
  id: number,
  data: { name?: string; sort?: number }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/albums/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update photo album");
  return await response.json();
};

export const deletePhotoAlbum = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/albums/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete photo album");
  return await response.json();
};

// Фотографии
export const getPhotos = async (
  album_id: number
): Promise<{ photos: Photo[]; count: number }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/gallery/photos?album_id=${album_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch photos");
  return await response.json();
};

export const createPhoto = async (data: {
  album_id: number;
  name: string;
  date?: string;
  image: File;
}): Promise<{ message: string; photo: Photo }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("album_id", data.album_id.toString());
  formData.append("name", data.name);
  if (data.date) formData.append("date", data.date);
  formData.append("image", data.image);

  const response = await fetch(`${API_BASE_URL}/gallery/photos`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to create photo");
  return await response.json();
};

export const deletePhoto = async (id: number): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/photos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete photo");
  return await response.json();
};

// Видеоальбомы (аналогично фотоальбомам)
export const getVideoAlbums = async (): Promise<{
  albums: VideoAlbum[];
  count: number;
}> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/video/albums`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch video albums");
  return await response.json();
};

export const createVideoAlbum = async (data: {
  name: string;
  sort?: number;
}): Promise<{ message: string; album: VideoAlbum }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/video/albums`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create video album");
  return await response.json();
};

export const updateVideoAlbum = async (
  id: number,
  data: { name?: string; sort?: number }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/video/albums/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update video album");
  return await response.json();
};

export const deleteVideoAlbum = async (
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/video/albums/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete video album");
  return await response.json();
};

// Видео
export const getVideos = async (
  album_id: number
): Promise<{ videos: Video[]; count: number }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/gallery/video/videos?album_id=${album_id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch videos");
  return await response.json();
};

export const createVideo = async (data: {
  album_id: number;
  name: string;
  date: string;
  type: "youtube" | "download";
  iframe?: string;
  video?: File | null;
}): Promise<{ message: string; video: Video }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("album_id", data.album_id.toString());
  formData.append("name", data.name);
  formData.append("type", data.type);
  formData.append("date", data.date);
  if (data.iframe) formData.append("iframe", data.iframe);
  if (data.video) formData.append("video", data.video);

  const response = await fetch(`${API_BASE_URL}/gallery/video/videos`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to create video");
  return await response.json();
};

export const deleteVideo = async (id: number): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/gallery/video/videos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete video");
  return await response.json();
};
