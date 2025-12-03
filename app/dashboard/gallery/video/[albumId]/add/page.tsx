// app/dashboard/gallery/video/[albumId]/add/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import style from "../../../../categories/categories.module.scss";
import { createVideo, getVideoAlbums } from "@/utils/api/galleryApi";
import gal from "../../../gallery.module.scss";

export default function AddVideoPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.albumId as string;

  const [loading, setLoading] = useState<boolean>(false);
  const [album, setAlbum] = useState<any>(null);
  const [videoType, setVideoType] = useState<"youtube" | "download">("youtube");
  const [formData, setFormData] = useState({
    name: "",
    iframe: "",
    date: new Date().toISOString().slice(0, 16),
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    loadAlbum();
  }, [albumId]);

  const loadAlbum = async () => {
    try {
      const albumsData = await getVideoAlbums();
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

    if (videoType === "youtube" && !formData.iframe) {
      alert("Пожалуйста, введите ссылку на YouTube видео");
      return;
    }

    if (videoType === "download" && !videoFile) {
      alert("Пожалуйста, выберите видеофайл");
      return;
    }

    setLoading(true);

    try {
      await createVideo({
        album_id: parseInt(albumId),
        name: formData.name,
        type: videoType,
        date: formData.date,
        iframe: videoType === "youtube" ? formData.iframe : undefined,
        video: videoType === "download" ? videoFile : undefined,
      });

      alert("Видео успешно добавлено");
      router.push(`/dashboard/gallery/video/${albumId}`);
    } catch (error) {
      alert("Ошибка добавления видео: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  if (!album) {
    return <div className="container">Альбом не найден</div>;
  }

  return (
    <div className={`${style.categories__add__page} container`}>
      <div className={style.categories__add__page__top}>
        <h2>Добавить видео в альбом: {album.name}</h2>
        <Link href={`/dashboard/gallery/video/${albumId}`}>
          назад
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={style.categories__add__page__row}>
          <label htmlFor="name">Название видео *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Введите название видео"
          />
        </div>
        <div className={style.categories__add__page__row}>
          <label htmlFor="date">Дата видео *</label>
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
          <label>Тип видео *</label>
          <div className={gal.radio__group}>
            <div className={gal.radio__group__item}>
              <input
                type="radio"
                value="youtube"
                checked={videoType === "youtube"}
                onChange={() => setVideoType("youtube")}
              />
              YouTube видео
            </div>
            <div className={gal.radio__group__item}>
              <input
                type="radio"
                value="download"
                checked={videoType === "download"}
                onChange={() => setVideoType("download")}
              />
              Загрузить видео
            </div>
          </div>
        </div>

        {videoType === "youtube" && (
          <div className={style.categories__add__page__row}>
            <label htmlFor="iframe">YouTube ссылка *</label>
            <textarea
              id="iframe"
              name="iframe"
              required
              value={formData.iframe}
              onChange={handleChange}
              placeholder="Вставьте ссылку на YouTube видео"
              rows={4}
            />
          </div>
        )}

        {videoType === "download" && (
          <div className={style.categories__add__page__row}>
            <label htmlFor="video">Видеофайл *</label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleVideoChange}
              required
            />
            <small>Выберите видеофайл для загрузки (макс. 100MB)</small>
          </div>
        )}

        <div className={style.categories__add__page__row}>
          <button type="submit" disabled={loading} className="confirm__button">
            {loading ? "Добавление..." : "Добавить видео"}
          </button>
        </div>
      </form>
    </div>
  );
}
