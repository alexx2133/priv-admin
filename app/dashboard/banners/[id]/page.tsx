"use client";
import { useState, useEffect, use } from "react";
import { getBanners, deleteBanner } from "@/utils/api/bannersApi";
import { Banner } from "@/types/banners";
import { usePathname } from "next/navigation";
import { Column } from "../../categories/page";
import cat from "../../categories/categories.module.scss";
import style from "../banners.module.scss";
import Link from "next/link";
import { API_IMAGE_PATH } from "@/utils/utils";
const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filter, setFilter] = useState<"active" | "all">("active");
  const [groupId, setGroupId] = useState<number>(0);
  const path = usePathname();
  const columns: Column[] = [
    { key: "id", label: "ID" },
    { key: "image", label: "Изображение" },
    { key: "sort", label: "Статус" },
    { key: "actions", label: "Действие" },
  ];
  const getPage = (groupId: number) => {
    if (groupId === 1) {
      return "Главная";
    } else if (groupId == 2) {
      return `Покупателям`;
    } else if (groupId == 3) {
      return `Продавцам`;
    }
  };
  useEffect(() => {
    if (groupId !== 0) {
      console.log(groupId);
      loadBanners(groupId);
    }
  }, [groupId, filter]);
  useEffect(() => {
    if (path) {
      const normalizedPath = path.endsWith("/") ? path.slice(0, -1) : path;
      let Id = parseInt(normalizedPath.split("/").pop() as string);
      // console.log(path.split("/"), path, Id);
      setGroupId(Id);
    }
    // loadBanners();
  }, [path]);
  const loadBanners = async (groupId: number) => {
    try {
      const data = await getBanners(groupId, filter);
      console.log(data);
      setBanners(data.banners);
    } catch (error) {
      console.error("Error loading banners:", error);
    }
  };
  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить баннер?")) {
      try {
        await deleteBanner(id);
        await loadBanners(groupId); // Перезагружаем список
      } catch (error) {
        console.error("Error deleting banner:", error);
      }
    }
  };
  return (
    <div className={`${style.banners} container`}>
      <div className={cat.categories__header}>
        <h2>Баннеры ({getPage(groupId)})</h2>
        <div className={style.banner__show}>
          <Link href="/dashboard/banners/add" className={cat.categories__add}>
            Добавить
          </Link>
          {filter === "active" ? (
            <button
              className={cat.categories__edit}
              onClick={() => setFilter("all")}
            >
              Показать удаленные
            </button>
          ) : (
            <button
              className={cat.categories__edit}
              onClick={() => setFilter("active")}
            >
              Только активные
            </button>
          )}
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
          {banners &&
            banners
              .sort((a, b) => a.sort - b.sort)
              .map((banner, i) => (
                <tr key={i}>
                  <td>{banner.id}</td>
                  <td>
                    {" "}
                    <img
                      src={API_IMAGE_PATH + `/banners/${banner.url}`}
                      alt={banner.id.toString()}
                    />
                  </td>
                  <td>{banner.status == 1 ? "Включен" : "Отключен"}</td>
                  <td>
                    <div className={style.banner__actions}>
                      <Link
                        href={`/dashboard/banners/edit/${banner.id}`}
                        className={cat.categories__edit}
                      >
                        Изменить
                      </Link>
                      <button
                        onClick={() => handleDelete(banner.id as number)}
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

export default BannersPage;
