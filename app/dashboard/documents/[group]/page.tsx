"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getDocumentGroups,
  deleteDocumentGroup,
} from "@/utils/api/documentsApi";
import { DocumentGroup } from "@/types/documents";
import { Column } from "../../categories/page";
import cat from "../../categories/categories.module.scss";
import style from "../documents.module.scss";
import Link from "next/link";

const DocumentPage = () => {
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const params = useParams();
  const group = params.group as string;

  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Название" },
    { key: "sort", label: "Сортировка" },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadGroups();
  }, [group]);

  const loadGroups = async () => {
    try {
      const data = await getDocumentGroups(group);
      setGroups(data.groups);
    } catch (error) {
      console.error("Error loading document groups:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить группу?")) {
      try {
        await deleteDocumentGroup(group, id);
        await loadGroups();
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };

  const getGroupTitle = () => {
    return group === "customers" ? "для клиентов" : "для продавцов";
  };

  return (
    <div className={`${style.documents} container`}>
      <div className={cat.categories__header}>
        <h2>Группы документов {getGroupTitle()}</h2>
        <div className={style.documents__show}>
          <Link
            href={`/dashboard/documents/${group}/add`}
            className={cat.categories__add}
          >
            Добавить группу
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} className={column.key == "sort" ? cat.hide : ""}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groups &&
            groups
              .sort((a, b) => a.sort - b.sort)
              .map((item, i) => (
                <tr key={i}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td className={cat.hide}>{item.sort}</td>
                  <td>
                    <div className={style.documents__actions}>
                      <Link
                        href={`/dashboard/documents/${group}/list/${item.id}`}
                        className={cat.categories__edit}
                      >
                        Список документов
                      </Link>
                      <Link
                        href={`/dashboard/documents/${group}/edit/${item.id}`}
                        className={`${cat.categories__edit} ${cat.hide}`}
                      >
                        Редактировать
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

export default DocumentPage;
