"use client";

import { useRouter } from "next/router";
import style from "./settings.module.scss";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentPage, setCurrentPage] = useState<string>("");
  const pathname = usePathname();
  useEffect(() => {
    if(pathname) {
      const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
      setCurrentPage(normalizedPath);
    }
  }, [pathname]);
  const settingsSections = [
    {
      title: "Контакты",
      href: "/dashboard/settings/contacts",
    },
    {
      title: "Фон в шапке",
      href: "/dashboard/settings/headers",
    },
    {
      title: "Цены для покупателей",
      href: "/dashboard/settings/buyers_price",
    },
    {
      title: "Цена для продавцов",
      href: "/dashboard/settings/sellers_price",
    },
    {
      title: "Покупателям",
      href: "/dashboard/settings/buyers",
    },
    // {
    //   title: "Страницы",
    //   href: "/dashboard/settings/pages",
    // },
    {
      title: "Схема рынка",
      href: "/dashboard/settings/schema",
    },
  ];
  return (
    <div className={`${style.settings} container`}>
      <div className={style.settings__title}>
        <h2>Настройки</h2>
      </div>

      <div className={style.settings__links}>
        {settingsSections.map((section, index) => (
          <Link
            className={`${style.settings__link} ${
              currentPage === section.href ? style.active : ""
            }`}
            href={section.href}
            key={index}
          >
            {section.title}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
