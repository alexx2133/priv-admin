// app/dashboard/gallery/video/[albumId]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Video, VideoAlbum } from "@/types/gallery";
import { Column } from "../../../categories/page";
import cat from "../../../categories/categories.module.scss";
import style from "../../gallery.module.scss";
import Link from "next/link";
import { getVideos, deleteVideo, getVideoAlbums } from "@/utils/api/galleryApi";
import HtmlViewer from "@/components/editor/htmlViewer";
import { API_VIDEO_PATH } from "@/utils/utils";

const VideoAlbumPage = () => {
  const params = useParams();
  const router = useRouter();
  const albumId = params.albumId as string;

  const [videos, setVideos] = useState<Video[]>([]);
  const [album, setAlbum] = useState<VideoAlbum | null>(null);
  const [loading, setLoading] = useState(true);

  const columns: Column[] = [
    { key: "name", label: "Название" },
    { key: "type", label: "Тип" },
    { key: "preview", label: "Видео" },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadAlbumAndVideos();
  }, [albumId]);

  const loadAlbumAndVideos = async () => {
    setLoading(true);
    try {
      // Загружаем информацию об альбоме
      const albumsData = await getVideoAlbums();
      const currentAlbum = albumsData.albums.find(
        (a) => a.id === parseInt(albumId)
      );
      setAlbum(currentAlbum || null);

      // Загружаем видео альбома
      if (currentAlbum) {
        const videosData = await getVideos(parseInt(albumId));
        setVideos(videosData.videos);
      }
    } catch (error) {
      console.error("Error loading album videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить видео?")) {
      try {
        await deleteVideo(id);
        await loadAlbumAndVideos();
      } catch (error) {
        console.error("Error deleting video:", error);
      }
    }
  };

  const renderVideoPreview = (video: Video) => {
    if (video.type === "youtube" && video.iframe) {
      return <div dangerouslySetInnerHTML={{ __html: video.iframe }}></div>;
    } else if (video.type === "download" && video.filename) {
      return (
        <video
          controls
          className={style.video__preview}
          src={API_VIDEO_PATH + `/gallery/${video.filename}`}
        >
          Ваш браузер не поддерживает видео.
        </video>
      );
    }
    return <span>Нет превью</span>;
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  if (!album) {
    return (
      <div className="container">
        <div className={cat.categories__header}>
          <h2>Альбом не найден</h2>
          <Link href="/dashboard/gallery/video" className={cat.categories__add}>
            назад
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${style.gallery} container`}>
      <div className={cat.categories__header}>
        <h2>Видео альбома: {album.name}</h2>
        <div className={style.gallery__show}>
          <Link
            href={`/dashboard/gallery/video/${albumId}/add`}
            className={cat.categories__add}
          >
            Добавить видео
          </Link>
          <Link
            href="/dashboard/gallery/video"
            className={cat.categories__edit}
          >
            назад
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {videos && videos.length > 0 ? (
            videos.map((video, i) => (
              <tr key={i}>
                <td>{video.name}</td>
                <td>
                  {video.type === "youtube" ? "YouTube" : "Загруженное видео"}
                </td>
                <td>{renderVideoPreview(video)}</td>
                <td>
                  <div className={style.gallery__actions}>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className={cat.categories__delete}
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                В этом альбоме пока нет видео
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VideoAlbumPage;
