// app/dashboard/news/edit/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { News } from "@/types/news";
import Link from "next/link";
import style from "../../../categories/categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getNewsById, updateNews } from "@/utils/api/newsApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function EditNewsPage() {
  const params = useParams();
  const router = useRouter();
  const newsId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [news, setNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    date: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    loadNews();
  }, [newsId]);

  const loadNews = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getNewsById(parseInt(newsId));
      setNews(data.news);
      setFormData({
        title: data.news.title,
        text: data.news.text,
        date: data.news.date.replace(" ", "T").slice(0, 16), // преобразуем для input
      });
      setCurrentImage(data.news.image);
    } catch (error) {
      alert("Ошибка загрузки новости: " + (error as Error).message);
      router.push("/dashboard/news");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateNews(parseInt(newsId), {
        title: formData.title,
        text: formData.text,
        date: formData.date.replace("T", " ") + ":00",
        image: image || undefined,
      });

      alert("Новость успешно обновлена");
      router.push("/dashboard/news");
    } catch (error) {
      alert("Ошибка обновления новости: " + (error as Error).message);
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

  if (!news) {
    return <div>Новость не найдена</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Редактировать новость #{news.id}</h2>
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
          <label htmlFor="image">Изображение новости</label>
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
          <div className={style.news__edit__page__preview}>
            <p>Текущее изображение:</p>
            <img
              src={API_IMAGE_PATH + `/news/${currentImage}`}
              alt="Текущая новость"
              className={style.news__edit__page__image}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {image && (
          <div className={style.news__edit__page__preview}>
            <p>Новое изображение: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр новости"
              className={style.news__edit__page__image}
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
