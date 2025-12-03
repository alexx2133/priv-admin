"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import style from "./dashboard.module.scss";
import Link from "next/link";
import { isTokenExpired } from "@/utils/jwt";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = (): void => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    setIsAuthenticated(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const rows = [
    {
      links: [{ title: "Категории", link: "/dashboard/categories" }],
    },
    {
      links: [{ title: "Товары", link: "/dashboard/products" }],
    },
    {
      title: "Галерея",
      links: [
        { title: "Фото", link: "/dashboard/gallery/photo" },
        { title: "Видео", link: "/dashboard/gallery/video" },
      ],
    },
    {
      links: [{ title: "Новости", link: "/dashboard/news" }],
    },
    {
      links: [{ title: "История", link: "/dashboard/history" }],
    },
    {
      title: "Загрузка документов",
      links: [
        { title: "Продавцам", link: "/dashboard/documents/sellers" },
        { title: "Покупателям", link: "/dashboard/documents/customers" },
      ],
    },
    {
      title: "Баннеры",
      links: [
        { title: "Главная", link: "/dashboard/banners/1" },
        { title: "Покупателям", link: "/dashboard/banners/2" },
        { title: "Продавцам", link: "/dashboard/banners/3" },
      ],
    },
    {
      links: [{ title: "Настройки", link: "/dashboard/settings/contacts" }],
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className={style.dashboard}>
      <div
        className={`${style.mobileHeader} ${
          isMobileMenuOpen ? style.mobileHeaderClosed : ""
        }`}
      >
        <button className={style.burgerButton} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div>Меню</div>
      </div>
      <div className={style.sidebar}>
        {rows.map((row, index) => (
          <div key={index} className={style.row}>
            {row.title && <div className={style.title}>{row.title}</div>}
            {row.links.map((link, linkIndex) => (
              <Link key={linkIndex} href={link.link} className={style.link}>
                {row.links.length > 1 && "- "}
                {link.title}
              </Link>
            ))}
          </div>
        ))}
        <button onClick={handleLogout} className={style.logout}>
          Выйти
        </button>
      </div>

      <div
        className={`${style.mobileMenu} ${
          isMobileMenuOpen ? style.mobileMenuOpen : ""
        }`}
      >
        <div className={style.mobileMenuContent}>
          <button className={style.closeButton} onClick={closeMobileMenu}>
            x
          </button>
          {rows.map((row, index) => (
            <div key={index} className={style.mobileRow}>
              {row.title && (
                <div className={style.mobileTitle}>{row.title}</div>
              )}
              {row.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  href={link.link}
                  className={style.mobileLink}
                  onClick={closeMobileMenu}
                >
                  {row.links.length > 1 && "- "}
                  {link.title}
                </Link>
              ))}
            </div>
          ))}
          <button onClick={handleLogout} className={style.mobileLogout}>
            Выйти
          </button>
        </div>
      </div>

      {children}
    </div>
  );
}
