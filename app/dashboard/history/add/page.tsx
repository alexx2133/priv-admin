"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../categories/categories.module.scss";
import { createHistory } from "@/utils/api/historyApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState({
    year: 0,
    text: "",
    sort: 0,
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!history) return;
      await createHistory(history);
      router.push("/dashboard/history");
    } catch (error) {
      alert("Error updating category: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any): void => {
    const { name, value } = e.target;
    setHistory((prev) => ({
      ...prev,
      [name]: name === "sort" || name == "year" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавление события</h2>
        <Link href="/dashboard/history">назад</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Год</label>
          <input
            type="number"
            id="year"
            name="year"
            required
            value={history.year}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="text">Событие</label>
          <Editor
            text={history.text}
            setText={(text: string) =>
              setHistory((prev) => ({ ...prev, text: text }))
            }
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="sort">Сортировка</label>
          <input
            type="number"
            id="sort"
            name="sort"
            value={history.sort}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Создание..." : "Добавить событие"}
          </button>
        </div>
      </form>
    </div>
  );
}
