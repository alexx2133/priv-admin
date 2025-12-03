// app/dashboard/products/edit/[id]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/types/products";
import Link from "next/link";
import style from "../../../categories/categories.module.scss";
import prod from "../../products.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getProduct, updateProduct } from "@/utils/api/productsApi";
import { getCategories } from "@/utils/api/categoryApi";
import { Category } from "@/types/category";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
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
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    loadProductAndCategories();
  }, [productId]);

  const loadProductAndCategories = async () => {
    setLoading(true);
    try {
      const [productData, categoriesData] = await Promise.all([
        getProduct(parseInt(productId)),
        getCategories(),
      ]);

      setProduct(productData.product);
      setCategories(categoriesData.categories);
      setFormData({
        category_id: productData.product.category_id,
        name: productData.product.name,
        opt_price_min: productData.product.opt_price_min,
        opt_price_max: productData.product.opt_price_max,
        opt_unit: productData.product.opt_unit,
        rozn_price_min: productData.product.rozn_price_min,
        rozn_price_max: productData.product.rozn_price_max,
        rozn_unit: productData.product.rozn_unit,
      });
      setCurrentImage(productData.product.image);
    } catch (error) {
      alert("Ошибка загрузки товара: " + (error as Error).message);
      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProduct(parseInt(productId), {
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

      alert("Товар успешно обновлен");
      router.push("/dashboard/products");
    } catch (error) {
      alert("Ошибка обновления товара: " + (error as Error).message);
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

  if (!product) {
    return <div className="container">Товар не найден</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Редактировать товар #{product.id}</h2>
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

        {!currentImage && !image && (
          <div className={style.categories__add__page__row}>
            <label htmlFor="image">Изображение (290х252)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>
              Оставьте пустым, чтобы не изменять текущее изображение
            </small>
          </div>
        )}
        {currentImage && !image && (
          <div className={prod.products__edit__page__preview}>
            <p>Текущее изображение:</p>
            <img
              src={API_IMAGE_PATH + `/products/${currentImage}`}
              alt="Текущий товар"
              className={prod.products__edit__page__image}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setCurrentImage("")}
              className={style.products__edit__page__delete}
            >
              Удалить
            </button>
          </div>
        )}

        {image && (
          <div className={prod.products__edit__page__preview}>
            <p>Новое изображение: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр товара"
              className={prod.products__edit__page__image}
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className={style.products__edit__page__delete}
            >
              Удалить
            </button>
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
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
