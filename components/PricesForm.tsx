"use client";
import { useEffect, useState } from "react";
import styles from "./styles/prices.module.scss";
import { ProcessedSetting } from "@/types/settings";
import { updateMultipleSettings } from "@/utils/api/settingsApi";

const PricesForm = ({ initSections }: { initSections: ProcessedSetting[] }) => {
  const [sections, setSections] = useState<ProcessedSetting[]>(initSections);

  useEffect(() => {
    if (initSections && initSections.length > 0) {
      setSections(initSections);
    }
  }, [initSections]);

  const handleChange = (id: number, field: "price" | "data", value: string) => {
    setSections((prevSections) =>
      prevSections.map((section) => {
        if (section.price.id === id && field === "price") {
          return {
            ...section,
            price: {
              ...section.price,
              info: value,
            },
          };
        } else if (section.data.id === id && field === "data") {
          return {
            ...section,
            data: {
              ...section.data,
              info: value,
            },
          };
        }
        return section;
      })
    );
  };

  const handleSave = async () => {
    try {
      // Собираем все изменения в формате для API
      const updates = sections.flatMap((section) => [
        {
          id: section.price.id, // Преобразуем в number
          data: section.price.info,
        },
        {
          id: section.data.id, // Преобразуем в number
          data: section.data.info,
        },
      ]);

      // Отправляем одним запросом все обновления
      await updateMultipleSettings(updates);

      console.log("Saved data:", sections);
      alert("Настройки успешно сохранены!");
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка при сохранении настроек: " + (error as Error).message);
    }
  };

  return (
    <div className={styles.pricing}>
      {sections
        .sort((a, b) => Number(a.price.info) - Number(b.price.info))
        .map((section, index) => (
          <div key={index} className={styles.pricing__block}>
            <b>
              <label className={styles.pricing__title}>
                {section.description}
              </label>
            </b>
            <div className={styles.pricing__inputs}>
              <label className={styles.pricing__title}>Цена</label>
              <input
                type="text"
                placeholder=""
                value={section.price.info}
                onChange={(e) =>
                  handleChange(section.price.id, "price", e.target.value)
                }
                className={styles.pricing__input}
              />
              <label className={styles.pricing__title}>Описание</label>
              <textarea
                placeholder=""
                value={section.data.info}
                onChange={(e) =>
                  handleChange(section.data.id, "data", e.target.value)
                }
                className={styles.pricing__input}
              />
            </div>
          </div>
        ))}

      <button className="confirm__button" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
};

export default PricesForm;
