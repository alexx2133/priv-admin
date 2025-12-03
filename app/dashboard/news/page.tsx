// app/dashboard/news/page.tsx
"use client";
import { useState, useEffect } from "react";
import { getNews, deleteNews } from "@/utils/api/newsApi";
import { News } from "@/types/news";
import { Column } from "../categories/page";
import cat from "../categories/categories.module.scss";
import style from "./news.module.scss";
import Link from "next/link";
import { API_IMAGE_PATH } from "@/utils/utils";

const NewsPage = () => {
  const [news, setNews] = useState<News[]>([]);

  const columns: Column[] = [
    { key: "title", label: "Название" },
    { key: "date", label: "Дата" },
    { key: "image", label: "Изображение" },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const data = await getNews();
      setNews(data.news);
    } catch (error) {
      console.error("Error loading news:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить новость?")) {
      try {
        await deleteNews(id);
        await loadNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`${style.news} container`}>
      <div className={cat.categories__header}>
        <h2>Новости</h2>
        <div className={style.news__show}>
          <Link href="/dashboard/news/add" className={cat.categories__add}>
            Добавить
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
                  column.key == "image" || column.key == "date" ? cat.hide : ""
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {news &&
            news
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map((item, i) => (
                <tr key={i}>
                  <td>{item.title}</td>
                  <td className={cat.hide}>{formatDate(item.date)}</td>
                  <td className={cat.hide}>
                    <img
                      src={API_IMAGE_PATH + `/news/${item.image}`}
                      alt={item.title}
                      className={style.news__image}
                    />
                  </td>
                  <td>
                    <div className={style.news__actions}>
                      <Link
                        href={`/dashboard/news/edit/${item.id}`}
                        className={cat.categories__edit}
                      >
                        Изменить
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className={cat.categories__delete}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsPage;
