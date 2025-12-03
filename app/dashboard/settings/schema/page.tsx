"use client"
import { API_IMAGE_PATH } from "@/utils/utils";
import style from "../headers/headers.module.scss";
import { useEffect, useState } from "react";
import { Setting } from "@/types/settings";
import { getSettingsByGroup, updateSettingImage } from "@/utils/api/settingsApi";
const Schema = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getSettingId = (name: string): number => {
    return settings.find((s) => s.name === name)?.id || 4;
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleImageUpload = async (id: number, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      await updateSettingImage(id, formData);
      alert("Изображение обновлено!");
      loadSettings();
    } catch (error) {
      alert("Ошибка загрузки изображения: " + (error as Error).message);
    }
  };

  const getSettingValue = (name: string): string => {
    return settings.find((s) => s.name === name)?.data || "";
  };

  const loadSettings = async (): Promise<void> => {
    try {
      const data = await getSettingsByGroup("schema");
      setSettings(data.settings);
    } catch (error) {
      alert("Ошибка загрузки настроек: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <h2>Схема рынка</h2>
      <img
        src={`${API_IMAGE_PATH}/settings/${getSettingValue(
          "schema_image"
        )}`}
        alt="schema_image"
        className={style.headers__home}
      />
      <button className="confirm__button">Обновить</button>
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          handleImageUpload(
            getSettingId("schema_image"),
            e.target.files![0]
          )
        }
        className={style.hidden__input}
      />
    </div>
  );
};
export default Schema;
