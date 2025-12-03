"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDocuments, deleteDocument } from "@/utils/api/documentsApi";
import { DocumentItem } from "@/types/documents";
import { Column } from "../../../../categories/page";
import cat from "../../../../categories/categories.module.scss";
import style from "../list.module.scss";
import Link from "next/link";
import { API_BASE_URL } from "@/utils/utils";

const DocumentsListPage = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [groupName, setGroupName] = useState<string>("");
  const params = useParams();
  const router = useRouter();
  const group = params.group as string;
  const group_id = parseInt(params.group_id as string);

  const columns: Column[] = [
    // { key: "id", label: "ID" },
    { key: "name", label: "Название" },
    { key: "company_person", label: "Юр. лицо" },
    { key: "individual_person", label: "ИП" },
    { key: "physical_person", label: "Физ. лицо" },
    { key: "actions", label: "Действие" },
  ];

  useEffect(() => {
    loadDocuments();
    loadGroupName();
  }, [group, group_id]);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments(group, group_id);
      setDocuments(data.documents);
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const loadGroupName = async () => {
    // Здесь нужно получить название группы по group_id
    // Пока используем заглушку
    setGroupName(`Группа ${group_id}`);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить документ?")) {
      try {
        await deleteDocument(group, id);
        await loadDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const getPersonStatus = (value: number) => {
    return value === 1 ? "Да" : "";
  };

  const getGroupTitle = () => {
    return group === "customers" ? "для клиентов" : "для продавцов";
  };

  return (
    <div className={`${style.documentsList} container`}>
      <div className={cat.categories__header}>
        <h2>
          Список документов {getGroupTitle()} - {groupName}
        </h2>
        <div className={style.documentsList__show}>
          <Link
            href={`/dashboard/documents/${group}/list/${group_id}/add`}
            className={cat.categories__add}
          >
            Добавить документ
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents &&
            documents.map((item, i) => (
              <tr key={i}>
                {/* <td>{item.id}</td> */}
                <td>{item.name}</td>
                <td>{getPersonStatus(item.company_person)}</td>
                <td>{getPersonStatus(item.individual_person)}</td>
                <td>{getPersonStatus(item.physical_person)}</td>
                <td>
                  <div className={style.documentsList__actions}>
                    <a
                      href={API_BASE_URL + `/documentsUpload/${item.path}`}
                      target="_blank"
                      className={cat.categories__edit}
                    >
                      Скачать
                    </a>
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

export default DocumentsListPage;
