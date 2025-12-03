"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../../../categories/categories.module.scss";
import {
  getDocumentGroupById,
  updateDocumentGroup,
} from "@/utils/api/documentsApi";

export default function EditDocumentGroupPage() {
  const router = useRouter();
  const params = useParams();
  const group = params.group as string;
  const id = parseInt(params.id as string);

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    sort: 0,
  });

  useEffect(() => {
    loadGroup();
  }, [group, id]);

  const loadGroup = async () => {
    try {
      const data = await getDocumentGroupById(group, id);
      setFormData({
        name: data.group.name,
        sort: data.group.sort,
      });
    } catch (error) {
      console.error("Error loading group:", error);
      alert("Ошибка загрузки группы");
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateDocumentGroup(group, id, formData);
      alert("Группа успешно обновлена");
      router.push(`/dashboard/documents/${group}`);
    } catch (error) {
      alert("Ошибка обновления группы: " + (error as Error).message);
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
        <h2>Редактировать группу документов {getGroupTitle()}</h2>
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
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
