"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import prod from "../../../products.module.scss";
import style from "../../../../categories/categories.module.scss";
import {
  getProductHistoryById,
  updateProductHistory,
} from "@/utils/api/productHistoryApi";
import { ProductHistory } from "@/types/products";

export default function EditProductHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = parseInt(params.id as string, 10);

  const [loading, setLoading] = useState<boolean>(false);
  const [historyItem, setHistoryItem] = useState<ProductHistory | null>(null);
  const [formData, setFormData] = useState({
    opt_price_min: 0,
    opt_price_max: 0,
    opt_unit: 0,
    rozn_price_min: 0,
    rozn_price_max: 0,
    rozn_unit: 0,
  });

  // Загружаем запись при монтировании
  useEffect(() => {
    if (historyId) loadHistoryItem();
  }, [historyId]);

  const loadHistoryItem = async () => {
    setLoading(true);
    try {
      const { history } = await getProductHistoryById(historyId);
      setHistoryItem(history);
      setFormData({
        opt_price_min: history.opt_price_min,
        opt_price_max: history.opt_price_max,
        opt_unit: history.opt_unit,
        rozn_price_min: history.rozn_price_min,
        rozn_price_max: history.rozn_price_max,
        rozn_unit: history.rozn_unit,
      });
    } catch (error) {
      alert("Ошибка загрузки записи истории: " + (error as Error).message);
      router.push("/dashboard/products/history");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProductHistory(historyId, formData);
      alert("Запись успешно обновлена");
      router.push("/dashboard/products/history");
    } catch (error) {
      alert("Ошибка обновления записи: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("unit") ? parseInt(value) : parseFloat(value) || 0,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  if (!historyItem) {
    return <div className="container">Загрузка...</div>;
  }

  const unitOptions = [
    { value: 0, label: "Не выбрано" },
    { value: 1, label: "кг" },
    { value: 2, label: "шт" },
    { value: 3, label: "пучок" },
    { value: 4, label: "ящик" },
  ];

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>{historyItem.product_name}</h2>
        <Link href="/dashboard/products/history">Назад к истории</Link>
      </div>

      <div className={style.readonlyInfo}>
        <div className={style.infoRow}>
          <strong>Дата:</strong> {formatDate(historyItem.created)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 className={prod.products__add__title}>Оптовые цены</h3>
        <div className={prod.products__add__row}>
          <div className={prod.products__add__price}>
            <label htmlFor="opt_price_min">Мин. цена</label>
            <input
              type="number"
              id="opt_price_min"
              name="opt_price_min"
              step="0.01"
              value={formData.opt_price_min}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className={prod.products__add__price}>
            <label htmlFor="opt_price_max">Макс. цена</label>
            <input
              type="number"
              id="opt_price_max"
              name="opt_price_max"
              step="0.01"
              value={formData.opt_price_max}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className={prod.products__add__price}>
            <label htmlFor="opt_unit">Ед. изм.</label>
            <select
              id="opt_unit"
              name="opt_unit"
              value={formData.opt_unit}
              onChange={handleChange}
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h3 className={prod.products__add__title}>Розничные цены</h3>
        <div className={prod.products__add__row}>
          <div className={prod.products__add__price}>
            <label htmlFor="rozn_price_min">Мин. цена</label>
            <input
              type="number"
              id="rozn_price_min"
              name="rozn_price_min"
              step="0.01"
              value={formData.rozn_price_min}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className={prod.products__add__price}>
            <label htmlFor="rozn_price_max">Макс. цена</label>
            <input
              type="number"
              id="rozn_price_max"
              name="rozn_price_max"
              step="0.01"
              value={formData.rozn_price_max}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className={prod.products__add__price}>
            <label htmlFor="rozn_unit">Ед. изм.</label>
            <select
              id="rozn_unit"
              name="rozn_unit"
              value={formData.rozn_unit}
              onChange={handleChange}
            >
              {unitOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
