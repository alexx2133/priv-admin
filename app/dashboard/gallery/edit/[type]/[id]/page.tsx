// app/dashboard/gallery/[type]/edit/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PhotoAlbum, VideoAlbum } from "@/types/gallery";
import Link from "next/link";
import style from "../../../../categories/categories.module.scss";
import {
  getPhotoAlbums,
  updatePhotoAlbum,
  getVideoAlbums,
  updateVideoAlbum,
} from "@/utils/api/galleryApi";

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as "photo" | "video";
  const albumId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [album, setAlbum] = useState<PhotoAlbum | VideoAlbum | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sort: "0",
  });

  useEffect(() => {
    loadAlbum();
  }, [albumId, type]);

  const loadAlbum = async (): Promise<void> => {
    setLoading(true);
    try {
      let data;
      if (type === "photo") {
        const response = await getPhotoAlbums();
        const foundAlbum = response.albums.find(
          (a) => a.id === parseInt(albumId)
        );
        setAlbum(foundAlbum || null);
        if (foundAlbum) {
          setFormData({
            name: foundAlbum.name,
            sort: foundAlbum.sort.toString(),
          });
        }
      } else {
        const response = await getVideoAlbums();
        const foundAlbum = response.albums.find(
          (a) => a.id === parseInt(albumId)
        );
        setAlbum(foundAlbum || null);
        if (foundAlbum) {
          setFormData({
            name: foundAlbum.name,
            sort: foundAlbum.sort.toString(),
          });
        }
      }
    } catch (error) {
      alert("Ошибка загрузки альбома: " + (error as Error).message);
      router.push(`/dashboard/gallery/${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "photo") {
        await updatePhotoAlbum(parseInt(albumId), {
          name: formData.name,
          sort: parseInt(formData.sort),
        });
      } else {
        await updateVideoAlbum(parseInt(albumId), {
          name: formData.name,
          sort: parseInt(formData.sort),
        });
      }

      const albumType = type === "photo" ? "фотоальбом" : "видеоальбом";
      alert(`${albumType} успешно обновлен`);
      router.push(`/dashboard/gallery/${type}`);
    } catch (error) {
      alert("Ошибка обновления альбома: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getPageTitle = () => {
    return type === "photo"
      ? "Редактировать фотоальбом"
      : "Редактировать видеоальбом";
  };

  if (!album) {
    return <div className="container">Альбом не найден</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>
          {getPageTitle()} #{album.id}
        </h2>
        <Link href={`/dashboard/gallery/${type}`}>
          Назад к {type === "photo" ? "фотоальбомам" : "видеоальбомам"}
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название альбома *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название альбома"
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="sort">Сортировка</label>
          <input
            type="number"
            id="sort"
            name="sort"
            value={formData.sort}
            onChange={(e) => {
              const value = e.target.value;
              if (/^-?\d*$/.test(value) || value === "" || value === "-") {
                handleChange(e);
              }
            }}
          />
        </div>

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
