"use client";
import Link from "next/link";
import style from "../categories/categories.module.scss";
import { useEffect, useState } from "react";
import { Category, History } from "@/types/category";
import { deleteHistory, getHistory } from "@/utils/api/historyApi";
import { deleteCategory } from "@/utils/api/categoryApi";
import HtmlViewer from "@/components/editor/htmlViewer";

const columns = [
  { key: "year", label: "Год" },
  { key: "name", label: "Событие" },
  { key: "sort", label: "Сортировка" },
  { key: "actions", label: "Действие" },
];
const HistoryPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<History[] | null>(null);
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getHistory();
      setHistory(data.histories.sort((a, b) => b.year - a.year));
    } catch (error) {
      alert("Error loading categories: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Вы уверены что хотите удалить категорию?")) return;

    try {
      await deleteHistory(id);
      loadHistory();
    } catch (error) {
      alert("Error deleting category: " + (error as Error).message);
    }
  };
  return (
    <div className={`${style.categories} container`}>
      <div className={style.categories__header}>
        <h2>Новости</h2>
        <Link href="/dashboard/history/add" className={style.categories__add}>
          Добавить
        </Link>
      </div>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={i} className={column.key == "sort" ? style.hide : ""}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history &&
              history.map((category, i) => (
                <tr key={i}>
                  <td>{category.year}</td>
                  <td>
                    <HtmlViewer html={category.text} />
                  </td>
                  <td className={style.hide}>{category.sort}</td>
                  <td>
                    <div className={style.categories__actions}>
                      <Link
                        href={`/dashboard/history/edit/${category.id}`}
                        className={style.categories__edit}
                      >
                        Изменить
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id as number)}
                        className={style.categories__delete}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {!history ||
        (history.length === 0 && !loading && (
          <div>No categories found. Create your first category!</div>
        ))}
    </div>
  );
};
export default HistoryPage;
