"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/types/category";
import Link from "next/link";

import style from "../../categories.module.scss";
import { API_IMAGE_PATH } from "@/utils/utils";
import { getCategoryById, updateCategory } from "@/utils/api/categoryApi";
export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sort: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>("");

  useEffect(() => {
    loadCategory();
  }, [categoryId]);

  const loadCategory = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await getCategoryById(parseInt(categoryId));
      setCategory(data.category);
      setFormData({
        name: data.category.name,
        sort: data.category.sort,
      });
      setCurrentImage(data.category.image);
    } catch (error) {
      alert("Error loading category: " + (error as Error).message);
      router.push("/dashboard/categories");
    } finally {
      setLoading(false);
    }
  };

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

      await updateCategory(parseInt(categoryId), formDataToSend);
      router.push("/dashboard/categories");
    } catch (error) {
      alert("Error updating category: " + (error as Error).message);
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

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Настроить категорию: {category.name}</h2>
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
        </div>

        {currentImage && !image && (
          <div>
            <label>Текущее изображение: {currentImage}</label>
            <img
              src={API_IMAGE_PATH + `/categories/${category.image}`}
              alt="Current"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        {image && (
          <div>
            <label>Новое изображение: {image.name}</label>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              style={{ maxWidth: "200px", maxHeight: "200px" }}
            />
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
