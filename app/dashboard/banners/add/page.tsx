"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import style from "../../categories/categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { createBanner } from "@/utils/api/bannersApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function AddBannerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    group_id: 1,
    text: "",
    sort: 0,
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!image) {
      alert("Пожалуйста, выберите изображение для баннера");
      return;
    }

    setLoading(true);

    try {
      await createBanner({
        group_id: formData.group_id,
        text: formData.text,
        image: image,
        sort: formData.sort,
      });
      alert("Баннер успешно создан");
      router.push("/dashboard/banners/" + formData.group_id);
    } catch (error) {
      alert("Ошибка создания баннера: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "group_id" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавить новый баннер</h2>
        <Link href={"/dashboard/banners/" + formData.group_id}>
          Назад к баннерам
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="group_id">Cтраница баннера *</label>
          <select
            id="group_id"
            name="group_id"
            required
            value={formData.group_id}
            onChange={handleChange}
          >
            <option value={1}>Главная</option>
            <option value={2}>Покупателям</option>
            <option value={3}>Продавцам</option>
          </select>
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="sort">Сортировка</label>
          <input
            type="number"
            id="sort"
            name="sort"
            value={formData.sort}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sort: parseInt(e.target.value) || 0,
              }))
            }
            placeholder=""
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="text">Текст баннера *</label>
          <Editor
            text={formData.text}
            setText={(text: string) =>
              setFormData((prev) => ({ ...prev, text: text }))
            }
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="image">Изображение баннера *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>Выберите изображение для баннера</small>
        </div>

        {image && (
          <div className={style.banners__edit__page__preview}>
            <p>Предпросмотр изображения: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр баннера"
              className={style.banners__edit__page__image}
            />
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Создание..." : "Создать баннер"}
          </button>
        </div>
      </form>
    </div>
  );
}
