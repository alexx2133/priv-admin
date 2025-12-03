// app/dashboard/products/add/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../categories/categories.module.scss";
import prod from "../products.module.scss";
import { createProduct } from "@/utils/api/productsApi";
import { getCategories } from "@/utils/api/categoryApi";
import { Category } from "@/types/category";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    category_id: 0,
    name: "",
    opt_price_min: 0,
    opt_price_max: 0,
    opt_unit: 0,
    rozn_price_min: 0,
    rozn_price_max: 0,
    rozn_unit: 0,
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!formData.category_id || !formData.name) {
      alert("Пожалуйста, заполните обязательные поля");
      return;
    }

    setLoading(true);

    try {
      await createProduct({
        category_id: formData.category_id,
        name: formData.name,
        opt_price_min: formData.opt_price_min,
        opt_price_max: formData.opt_price_max,
        opt_unit: formData.opt_unit,
        rozn_price_min: formData.rozn_price_min,
        rozn_price_max: formData.rozn_price_max,
        rozn_unit: formData.rozn_unit,
        image: image || undefined,
      });
      alert("Товар успешно создан");
      router.push("/dashboard/products");
    } catch (error) {
      alert("Ошибка создания товара: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name.includes("unit") || name === "category_id"
          ? parseInt(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

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
        <h2>Добавить товар</h2>
        <Link href="/dashboard/products">Назад к товарам</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название товара"
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="category_id">Категория *</label>
          <select
            id="category_id"
            name="category_id"
            required
            value={formData.category_id}
            onChange={handleChange}
          >
            <option value={0}>Выберите категорию</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {!image && (
          <div className={style.categories__add__page__row}>
            <label htmlFor="image">Изображение (290х252)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        )}

        {image && (
          <div className={prod.products__edit__page__preview}>
            <p>Предпросмотр изображения: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр товара"
              className={prod.products__edit__page__image}
            />
          </div>
        )}

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
            {loading ? "Создание..." : "Создать товар"}
          </button>
        </div>
      </form>
    </div>
  );
}
