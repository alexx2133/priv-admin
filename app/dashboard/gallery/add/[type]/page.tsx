// app/dashboard/gallery/[type]/add/page.tsx
"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../../categories/categories.module.scss";
import { createPhotoAlbum, createVideoAlbum } from "@/utils/api/galleryApi";

export default function AddAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as "photo" | "video";

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    sort: 0,
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "photo") {
        await createPhotoAlbum({
          name: formData.name,
          sort: formData.sort,
        });
      } else {
        await createVideoAlbum({
          name: formData.name,
          sort: formData.sort,
        });
      }

      const albumType = type === "photo" ? "фотоальбом" : "видеоальбом";
      alert(`${albumType} успешно создан`);
      router.push(`/dashboard/gallery/${type}`);
    } catch (error) {
      alert("Ошибка создания альбома: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sort" ? parseInt(value) || 0 : value,
    }));
  };

  const getPageTitle = () => {
    return type === "photo" ? "Добавить фотоальбом" : "Добавить видеоальбом";
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>{getPageTitle()}</h2>
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
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Создание..." : "Создать альбом"}
          </button>
        </div>
      </form>
    </div>
  );
}
