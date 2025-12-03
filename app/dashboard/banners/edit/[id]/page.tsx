"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Banner } from "@/types/banners";
import Link from "next/link";

import style from "../../../categories/categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getBanner, updateBanner } from "@/utils/api/bannersApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function EditBannerPage() {
  const params = useParams();
  const router = useRouter();
  const bannerId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    group_id: 1,
    text: "",
    sort: 0, // Добавляем поле sort
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    loadBanner();
    console.log(bannerId);
  }, [bannerId]);

  const loadBanner = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getBanner(parseInt(bannerId));
      console.log(data);
      setBanner(data.banner);
      setFormData({
        group_id: data.banner.group_id,
        text: data.banner.text,
        sort: data.banner.sort || 0, // Устанавливаем значение sort
      });
      setCurrentImage(data.banner.url);
    } catch (error) {
      alert("Ошибка загрузки баннера: " + (error as Error).message);
      router.push("/dashboard/banners/" + formData.group_id);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateBanner(parseInt(bannerId), {
        group_id: formData.group_id,
        text: formData.text,
        sort: formData.sort, // Добавляем sort
        image: image || undefined,
      });

      alert("Баннер успешно обновлен");
      router.push("/dashboard/banners/" + formData.group_id);
    } catch (error) {
      alert("Ошибка обновления баннера: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "group_id" || name === "sort" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!banner) {
    return <div>Баннер не найден</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Редактировать баннер #{banner.id}</h2>
        <Link href={"/dashboard/banners/" + formData.group_id}>
          Назад к баннерам
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {/* <div className={style.categories__add__page__row}>
          <label htmlFor="group_id">Группа баннера</label>
          <select
            id="group_id"
            name="group_id"
            required
            value={formData.group_id}
            onChange={handleChange}
          >
            <option value={1}>Группа 1</option>
            <option value={2}>Группа 2</option>
            <option value={3}>Группа 3</option>
          </select>
        </div> */}

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
          <label htmlFor="text">Текст баннера</label>
          <Editor
            text={formData.text}
            setText={(text: string) =>
              setFormData((prev) => ({ ...prev, text: text }))
            }
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="image">Изображение баннера</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          <small>Оставьте пустым, чтобы не изменять текущее изображение</small>
        </div>

        {currentImage && !image && (
          <div className={style.banners__edit__page__preview}>
            <p>Текущее изображение:</p>
            <img
              src={API_IMAGE_PATH + `/banners/${currentImage}`}
              alt="Текущий баннер"
              className={style.banners__edit__page__image}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {image && (
          <div className={style.banners__edit__page__preview}>
            <p>Новое изображение: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр нового баннера"
              className={style.banners__edit__page__image}
            />
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
