"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import cat from "../../../../../categories/categories.module.scss";
import style from "../../list.module.scss";
import { createDocument } from "@/utils/api/documentsApi";

export default function AddDocumentPage() {
  const router = useRouter();
  const params = useParams();
  const group = params.group as string;
  const group_id = parseInt(params.group_id as string);

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    company_person: false,
    individual_person: false,
    physical_person: false,
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!documentFile) {
      alert("Пожалуйста, выберите файл документа");
      return;
    }

    setLoading(true);

    try {
      await createDocument(group, group_id, {
        ...formData,
        document: documentFile,
      });
      alert("Документ успешно создан");
      router.push(`/dashboard/documents/${group}/list/${group_id}`);
    } catch (error) {
      alert("Ошибка создания документа: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setDocumentFile(e.target.files[0]);
    }
  };

  const getGroupTitle = () => {
    return group === "customers" ? "для клиентов" : "для продавцов";
  };

  return (
    <div className={`${cat.categories__add__page} container`}>
      <div className={cat.categories__add__page__top}>
        <h2>Добавить документ {getGroupTitle()}</h2>
        <Link href={`/dashboard/documents/${group}/list/${group_id}`}>
          Назад к документам
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={cat.categories__add__page__row}>
          <label htmlFor="name">Название документа *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название документа"
          />
        </div>

        <div className={cat.categories__add__page__row}>
          <label htmlFor="document">Файл документа *</label>
          <input
            type="file"
            id="document"
            name="document"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
            required
          />
          <small>Разрешены файлы: PDF, DOC, DOCX, TXT (макс. 10MB)</small>
        </div>

        <div className={cat.categories__add__page__row}>
          <div className={style.checkboxGroup}>
            <div className={style.checkboxLabel}>
              <input
                type="checkbox"
                name="company_person"
                checked={formData.company_person}
                onChange={handleChange}
              />
              Юридическое лицо
            </div>
            <div className={style.checkboxLabel}>
              <input
                type="checkbox"
                name="individual_person"
                checked={formData.individual_person}
                onChange={handleChange}
              />
              Индивидуальный предприниматель
            </div>
            <div className={style.checkboxLabel}>
              <input
                type="checkbox"
                name="physical_person"
                checked={formData.physical_person}
                onChange={handleChange}
              />
              Физическое лицо
            </div>
          </div>
        </div>

        {documentFile && (
          <div className={style.documentPreview}>
            <p>Выбранный файл: {documentFile.name}</p>
          </div>
        )}

        <div className={cat.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Создание..." : "Создать документ"}
          </button>
        </div>
      </form>
    </div>
  );
}
