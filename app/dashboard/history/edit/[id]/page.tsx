"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category, History } from "@/types/category";
import Link from "next/link";
import style from "../../../categories/categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getHistoryById, updateHistory } from "@/utils/api/historyApi";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor/editor"), {
  ssr: false,
});

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<History | null>(null);

  useEffect(() => {
    loadHistory();
  }, [historyId]);

  const loadHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getHistoryById(parseInt(historyId));
      setHistory(data.history);
    } catch (error) {
      alert("Error loading category: " + (error as Error).message);
      router.push("/dashboard/history");
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (value: string, field: string): void => {
    if (history !== null) {
      setHistory({ ...history, [field]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (!history) return;
      await updateHistory(parseInt(historyId), history);
      console.log("test");
      alert("Баннер успешно обновлен");
      router.push("/dashboard/history");
    } catch (error) {
      alert("Error updating category: " + (error as Error).message);
    }
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Настроить событие: {history?.year}</h2>
        <Link href="/dashboard/history">назад</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="year">Год</label>
          <input
            type="text"
            id="year"
            name="year"
            required
            defaultValue={history?.year}
            onChange={(e) => handleChange(e.target.value, "year")}
            placeholder=""
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="text">Событие</label>
          <Editor
            text={history?.text as string}
            setText={(text: string) =>
              //@ts-ignore
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
            defaultValue={history?.sort}
            onChange={(e) => handleChange(e.target.value, "sort")}
            placeholder=""
          />
        </div>
        <button type="submit" className="confirm__button" disabled={loading}>
          Сохранить
        </button>
      </form>
    </div>
  );
}
