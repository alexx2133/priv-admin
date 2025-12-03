// app/dashboard/gallery/[type]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PhotoAlbum, VideoAlbum } from "@/types/gallery";
import { Column } from "../../categories/page";
import cat from "../../categories/categories.module.scss";
import style from "../gallery.module.scss";
import Link from "next/link";
import {
  getPhotoAlbums,
  deletePhotoAlbum,
  getVideoAlbums,
  deleteVideoAlbum,
} from "@/utils/api/galleryApi";

const GalleryAlbumsPage = () => {
  const params = useParams();
  const type = params.type as "photo" | "video";

  const [albums, setAlbums] = useState<(PhotoAlbum | VideoAlbum)[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column[] = [
    { key: "name", label: "Название" },
    // { key: "count", label: type === "photo" ? "Кол-во фото" : "Кол-во видео" },
    { key: "sort", label: "Сортировка" },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadAlbums();
  }, [type]);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      let data;
      if (type === "photo") {
        data = await getPhotoAlbums();
      } else {
        data = await getVideoAlbums();
      }
      setAlbums(data.albums);
    } catch (error) {
      console.error(`Error loading ${type} albums:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const albumType = type === "photo" ? "фотоальбом" : "видеоальбом";
    if (
      confirm(
        `Вы уверены, что хотите удалить ${albumType}? Все медиафайлы в нем также будут удалены.`
      )
    ) {
      try {
        if (type === "photo") {
          await deletePhotoAlbum(id);
        } else {
          await deleteVideoAlbum(id);
        }
        await loadAlbums();
      } catch (error) {
        console.error(`Error deleting ${type} album:`, error);
      }
    }
  };

  const getPageTitle = () => {
    return type === "photo" ? "Фотоальбомы" : "Видеоальбомы";
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <div className={`${style.gallery} container`}>
      <div className={cat.categories__header}>
        <h2>{getPageTitle()}</h2>
        <div className={style.gallery__show}>
          <Link
            href={`/dashboard/gallery/add/${type}`}
            className={cat.categories__add}
          >
            Добавить альбом
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                className={
                 column.key == "sort" ? cat.hide : ""
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {albums && albums.length > 0 ? (
            albums
              .sort((a, b) => a.sort - b.sort)
              .map((album, i) => (
                <tr key={i}>
                  <td>{album.name}</td>
                  {/* <td className={cat.hide}>{0}</td> */}
                  <td className={cat.hide}>{album.sort}</td>
                  <td>
                    <div className={style.gallery__actions}>
                      <Link
                        href={`/dashboard/gallery/${type}/${album.id}`}
                        className={cat.categories__add}
                      >
                        {type === "photo" ? "Фото" : "Видео"}
                      </Link>
                      <Link
                        href={`/dashboard/gallery/edit/${type}/${album.id}`}
                        className={cat.categories__edit}
                      >
                        Изменить
                      </Link>
                      <button
                        onClick={() => handleDelete(album.id)}
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
                Альбомы не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GalleryAlbumsPage;
