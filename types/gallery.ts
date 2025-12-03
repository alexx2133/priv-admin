// types/gallery.ts
export interface PhotoAlbum {
  id: number;
  name: string;
  sort: number;
  created: string;
}

export interface VideoAlbum {
  id: number;
  name: string;
  sort: number;
  created: string;
}

export interface Photo {
  id: number;
  album_id: number;
  name: string;
  image: string;
  date: string;
}

export interface Video {
  id: number;
  album_id: number;
  name: string;
  type: "youtube" | "download";
  filename: string;
  iframe: string;
}

export interface AlbumsResponse {
  albums: PhotoAlbum[] | VideoAlbum[];
  count: number;
}

export interface PhotosResponse {
  photos: Photo[];
  count: number;
}

export interface VideosResponse {
  videos: Video[];
  count: number;
}
