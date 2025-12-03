// app/dashboard/gallery/photo/[albumId]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Photo, PhotoAlbum } from "@/types/gallery";
import { Column } from "../../../categories/page";
import cat from "../../../categories/categories.module.scss";
import style from "../../gallery.module.scss";
import Link from "next/link";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getPhotos, deletePhoto, getPhotoAlbums } from "@/utils/api/galleryApi";

const PhotoAlbumPage = () => {
  const params = useParams();
  const router = useRouter();
  const albumId = params.albumId as string;

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [album, setAlbum] = useState<PhotoAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  const columns: Column[] = [
    { key: "name", label: "Название" },
    { key: "date", label: "Дата" },
    { key: "image", label: "Изображение" },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadAlbumAndPhotos();
  }, [albumId]);

  const loadAlbumAndPhotos = async () => {
    setLoading(true);
    try {
      // Загружаем информацию об альбоме
      const albumsData = await getPhotoAlbums();
      const currentAlbum = albumsData.albums.find(
        (a) => a.id === parseInt(albumId)
      );
      setAlbum(currentAlbum || null);

      // Загружаем фотографии альбома
      if (currentAlbum) {
        const photosData = await getPhotos(parseInt(albumId));
        setPhotos(photosData.photos);
      }
    } catch (error) {
      console.error("Error loading album photos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить фотографию?")) {
      try {
        await deletePhoto(id);
        await loadAlbumAndPhotos();
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  if (!album) {
    return (
      <div className="container">
        <div className={cat.categories__header}>
          <h2>Альбом не найден</h2>
          <Link href="/dashboard/gallery/photo" className={cat.categories__add}>
            Назад
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${style.gallery} container`}>
      <div className={cat.categories__header}>
        <h2>Фотографии альбома: {album.name}</h2>
        <div className={style.gallery__show}>
          <Link
            href={`/dashboard/gallery/photo/${albumId}/add`}
            className={cat.categories__add}
          >
            Добавить фото
          </Link>
          <Link
            href="/dashboard/gallery/photo"
            className={cat.categories__edit}
          >
            назад
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {photos && photos.length > 0 ? (
            photos
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((photo, i) => (
                <tr key={i}>
                  <td>{photo.name}</td>
                  <td>{formatDate(photo.date)}</td>
                  <td>
                    <img
                      src={API_IMAGE_PATH + `/gallery/${photo.image}`}
                      alt={photo.name}
                      className={style.gallery__image}
                    />
                  </td>
                  <td>
                    <div className={style.gallery__actions}>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className={cat.categories__delete}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                В этом альбоме пока нет фотографий
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PhotoAlbumPage;
