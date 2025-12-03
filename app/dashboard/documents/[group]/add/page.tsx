"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../../categories/categories.module.scss";
import { createDocumentGroup } from "@/utils/api/documentsApi";

export default function AddDocumentGroupPage() {
  const router = useRouter();
  const params = useParams();
  const group = params.group as string;
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    sort: 0,
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDocumentGroup(group, formData);
      alert("Группа успешно создана");
      router.push(`/dashboard/documents/${group}`);
    } catch (error) {
      alert("Ошибка создания группы: " + (error as Error).message);
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

  const getGroupTitle = () => {
    return group === "customers" ? "для клиентов" : "для продавцов";
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавить группу документов {getGroupTitle()}</h2>
        <Link href={`/dashboard/documents/${group}`}>Назад к группам</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название группы *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название группы"
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
            {loading ? "Создание..." : "Создать группу"}
          </button>
        </div>
      </form>
    </div>
  );
}
