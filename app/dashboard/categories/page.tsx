"use client";
import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import Link from "next/link";
import style from "./categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { deleteCategory, getCategories } from "@/utils/api/categoryApi";
export interface Column {
  key: string;
  label: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Название" },
    { key: "image", label: "Изображение" },
    { key: "sort", label: "Сортировка" },
    { key: "actions", label: "Действие" },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      alert("Error loading categories: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!confirm("Вы уверены что хотите удалить категорию?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      alert("Error deleting category: " + (error as Error).message);
    }
  };

  return (
    <div className={`${style.categories} container`}>
      <div className={style.categories__header}>
        <h2>Список категорий</h2>
        <Link
          href="/dashboard/categories/add"
          className={style.categories__add}
        >
          Добавить
        </Link>
      </div>

      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={
                    column.key == "image" || column.key == "sort"
                      ? style.hide
                      : ""
                  }
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td className={style.hide}>
                  {category.image ? (
                    <div>
                      <img
                        src={API_IMAGE_PATH + `/categories/${category.image}`}
                        alt={category.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* <span>{category.image}</span> */}
                    </div>
                  ) : (
                    <span>No image</span>
                  )}
                </td>
                <td className={style.hide}>{category.sort}</td>
                <td>
                  <div className={style.categories__actions}>
                    <Link
                      href={`/dashboard/categories/edit/${category.id}`}
                      className={style.categories__edit}
                    >
                      Изменить
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id)}
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

      {categories.length === 0 && !loading && (
        <div>No categories found. Create your first category!</div>
      )}
    </div>
  );
}
