"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import style from "../categories.module.scss";
import { createCategory } from "@/utils/api/categoryApi";
export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    sort: 0,
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("sort", formData.sort.toString());

      if (image) {
        formDataToSend.append("image", image);
      }

      await createCategory(formDataToSend);
      router.push("/dashboard/categories");
    } catch (error) {
      alert("Error creating category: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sort" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавление категории</h2>
        <Link href="/dashboard/categories">назад</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="sort">Сортировка</label>
          <input
            type="number"
            id="sort"
            name="sort"
            value={formData.sort}
            onChange={handleChange}
            placeholder=""
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="image">Изображение</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <div>
              <p>Выбрано: {image.name}</p>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading}>
            {loading ? "Создание..." : "Добавить категорию"}
          </button>
        </div>
      </form>
    </div>
  );
}
