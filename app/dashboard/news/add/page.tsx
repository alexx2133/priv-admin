// app/dashboard/news/add/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../categories/categories.module.scss";
import { createNews } from "@/utils/api/newsApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function AddNewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    date: new Date().toISOString().slice(0, 16), // текущая дата и время
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!image) {
      alert("Пожалуйста, выберите изображение для новости");
      return;
    }

    setLoading(true);

    try {
      await createNews({
        title: formData.title,
        text: formData.text,
        image: image,
        date: formData.date.replace("T", " ") + ":00", // преобразуем в формат MySQL
      });
      alert("Новость успешно создана");
      router.push("/dashboard/news");
    } catch (error) {
      alert("Ошибка создания новости: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        <h2>Добавить новость</h2>
        <Link href="/dashboard/news">Назад к новостям</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="title">Заголовок *</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="date">Дата и время *</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="text">Текст новости *</label>
          <Editor
            text={formData.text}
            setText={(text: string) =>
              setFormData((prev) => ({ ...prev, text: text }))
            }
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="image">Изображение новости *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>Выберите изображение для новости</small>
        </div>

        {image && (
          <div className={style.news__edit__page__preview}>
            <p>Предпросмотр изображения: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр новости"
              className={style.news__edit__page__image}
            />
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Создание..." : "Создать новость"}
          </button>
        </div>
      </form>
    </div>
  );
}
