"use client";
import { useState, useEffect } from "react";

import { Setting } from "@/types/settings";
import style from "./headers.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { title } from "process";
import {
  getSettingsByGroup,
  updateSetting,
  updateSettingImage,
} from "@/utils/api/settingsApi";
const headersImages = [
  { title: "Товары", name: "headers_products", link: "/products" },
  {
    title: "Сравнение",
    name: "headers_analytics_compare",
    link: "/analytics/compare",
  },
  { title: "Аналитика", name: "headers_analytics", link: "/analytics" },
  { title: "Покупателям", name: "headers_customers", link: "/buyers" },
  { title: "Продавцам", name: "headers_sellers", link: "/sellers_price" },
  {
    title: "Галерея фото",
    name: "headers_gallery_photo",
    link: "/gallery/photo",
  },
  {
    title: "Галерея видео",
    name: "headers_gallery_video",
    link: "/gallery/video",
  },
  { title: "О рынке", name: "headers_about", link: "/about" },
  { title: "Контакты", name: "headers_contacts", link: "/contacts" },
  { title: "Новости", name: "headers_news", link: "/news" },

  { title: "Просмотр новости", name: "headers_news_item", link: "/news/1" },
  {
    title: "Архив новостей",
    name: "headers_news_archive",
    link: "/news/archive",
  },
  { title: "Статьи", name: "headers_barticle", link: "/articles" },
];
export default function HeadersSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const data = await getSettingsByGroup("headers");
      setSettings(data.settings);
    } catch (error) {
      alert("Ошибка загрузки настроек: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveText = async (id: number, value: string): Promise<void> => {
    try {
      await updateSetting(id, value);
      // alert("Настройка сохранена!");
    } catch (error) {
      // alert("Ошибка сохранения настройки: " + (error as Error).message);
    }
  };

  const handleImageUpload = async (id: number, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      await updateSettingImage(id, formData);
      alert("Изображение обновлено!");
      // Перезагружаем настройки, чтобы получить новое имя файла
      loadSettings();
    } catch (error) {
      alert("Ошибка загрузки изображения: " + (error as Error).message);
    }
  };

  const handleChangeText = (id: number, value: string): void => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, data: value } : setting
      )
    );
  };

  const getSettingValue = (name: string): string => {
    return settings.find((s) => s.name === name)?.data || "";
  };
  const getSettingId = (name: string): number => {
    return settings.find((s) => s.name === name)?.id || 4;
  };

  return (
    <div className={style.headers}>
      <h1>Главная старница 1920x3300</h1>
      <div>
        <img
          src={`${API_IMAGE_PATH}/settings/${getSettingValue("headers_home")}`}
          alt="headers_home"
          className={style.headers__home}
        />
        <button className="confirm__button">Обновить</button>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            handleImageUpload(getSettingId("headers_home"), e.target.files![0])
          }
          className={style.hidden__input}
        />

        {/* headers_products */}
        <div className={style.headers__columns}>
          <div className={style.headers__column}>
            <h2>Левая колонка</h2>
            <img
              src={`${API_IMAGE_PATH}/settings/${getSettingValue(
                "headers_home_left"
              )}`}
              alt="headers_home_left"
              className={style.headers__home}
            />
            <button className="confirm__button">Обновить</button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(
                  getSettingId("headers_home_left"),
                  e.target.files![0]
                )
              }
              className={style.hidden__input}
            />
            <div className={style.headers__position}>
              <p>Позиция слева</p>
              <input
                type="number"
                value={getSettingValue("headers_home_left_x")}
                onChange={(e) => handleChangeText(65, e.target.value)}
                onBlur={() =>
                  handleSaveText(65, getSettingValue("headers_home_left_x"))
                }
              />
            </div>
            <div className={style.headers__position}>
              <p>Позиция cверху</p>
              <input
                type="number"
                value={getSettingValue("headers_home_left_y")}
                onChange={(e) => handleChangeText(66, e.target.value)}
                onBlur={() =>
                  handleSaveText(66, getSettingValue("headers_home_left_y"))
                }
              />
            </div>
          </div>
          <div className={style.headers__column}>
            <h2>Правая колонка</h2>
            <img
              src={`${API_IMAGE_PATH}/settings/${getSettingValue(
                "headers_home_right"
              )}`}
              alt="headers_home_right"
              className={style.headers__home}
            />
            <button className="confirm__button">Обновить</button>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload(
                  getSettingId("headers_home_right"),
                  e.target.files![0]
                )
              }
              className={style.hidden__input}
            />
            <div className={style.headers__position}>
              <p>Позиция справа</p>
              <input
                type="number"
                value={getSettingValue("headers_home_right_x")}
                onChange={(e) => handleChangeText(67, e.target.value)}
                onBlur={() =>
                  handleSaveText(67, getSettingValue("headers_home_right_x"))
                }
              />
            </div>
            <div className={style.headers__position}>
              <p>Позиция cверху</p>
              <input
                type="number"
                value={getSettingValue("headers_home_right_y")}
                onChange={(e) => handleChangeText(68, e.target.value)}
                onBlur={() =>
                  handleSaveText(68, getSettingValue("headers_home_right_y"))
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.headers__internal}>
        <h1>Внутренние страницы</h1>
        <h2>Необходимое разрешение изображения 1920x565px</h2>
        <div className={style.headers__image}>
          {headersImages.map((image, index) => (
            <div key={index} className={style.headers__image__item}>
              <b>
                <a
                  href={"https://privoz-crimea.ru" + image.link}
                  target="_blank"
                >
                  {image.title}
                </a>
              </b>
              <img
                src={`${API_IMAGE_PATH}/settings/${getSettingValue(
                  image.name
                )}`}
                alt={image.name}
                className={style.headers__home}
              />
              <button className="confirm__button">Обновить</button>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageUpload(
                    getSettingId(image.name),
                    e.target.files![0]
                  )
                }
                className={style.hidden__input}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
