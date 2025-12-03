// components/ImageWithContent.tsx
"use client";

import { ReactNode } from "react";
import HtmlViewer from "./htmlViewer";
import style from "./imageWith.module.scss";
interface ImageWithContentProps {
  image: ReactNode; // или string для src
  htmlContent: string;
}

export default function ImageWithContent({
  image,
  htmlContent,
}: ImageWithContentProps) {
  return (
    <div className={style.image_content__wrapper}>
      <div className={`${style.image__container} ${style.left}`}>
        {typeof image === "string" ? (
          <img
            src={image}
            alt="Content image"
            className={style.content_image}
          />
        ) : (
          image
        )}
      </div>

      <div className={style.text_content}>
        <HtmlViewer html={htmlContent} />
      </div>
    </div>
  );
}
