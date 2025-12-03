// app/dashboard/gallery/photo/[albumId]/add/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../../../categories/categories.module.scss";
import { createPhoto, getPhotoAlbums } from "@/utils/api/galleryApi";

export default function AddPhotoPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.albumId as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [album, setAlbum] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    date: new Date().toISOString().slice(0, 16),
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  const loadAlbum = async () => {
    try {
      const albumsData = await getPhotoAlbums();
      const currentAlbum = albumsData.albums.find(
        (a) => a.id === parseInt(albumId)
      );
      setAlbum(currentAlbum || null);
    } catch (error) {
      console.error("Error loading album:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!image) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    setLoading(true);

    try {
      await createPhoto({
        album_id: parseInt(albumId),
        name: formData.name,
        date: formData.date.replace("T", " ") + ":00",
        image: image,
      });

      alert("Фотография успешно добавлена");
      router.push(`/dashboard/gallery/photo/${albumId}`);
    } catch (error) {
      alert("Ошибка добавления фотографии: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!album) {
    return <div className="container">Альбом не найден</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавить фото в альбом: {album.name}</h2>
        <Link href={`/dashboard/gallery/photo/${albumId}`}>
          назад
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название фото *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название фото"
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="date">Дата фото *</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className={style.categories__add__page__row}>
          <label htmlFor="image">Изображение *</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          <small>Выберите изображение для загрузки</small>
        </div>

        {image && (
          <div className={style.gallery__edit__page__preview}>
            <p>Предпросмотр изображения: {image.name}</p>
            <img
              src={URL.createObjectURL(image)}
              alt="Предпросмотр"
              className={style.gallery__edit__page__image}
            />
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Добавление..." : "Добавить фото"}
          </button>
        </div>
      </form>
    </div>
  );
}
