// app/dashboard/products/page.tsx
"use client";
import { useState, useEffect } from "react";
import { getProducts, deleteProduct } from "@/utils/api/productsApi";
import { Product } from "@/types/products";
import { Column } from "../categories/page";
import cat from "../categories/categories.module.scss";
import style from "./products.module.scss";
import Link from "next/link";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column[] = [
    { key: "name", label: "Название" },
    { key: "opt_price_min", label: "Опт мин." },
    { key: "opt_price_max", label: "Опт макс." },
    { key: "opt_unit", label: "Опт тип." },
    { key: "rozn_price_min", label: "Розн мин." },
    { key: "rozn_price_max", label: "Розн макс." },
    { key: "rozn_unit", label: "Розн тип." },
    { key: "actions", label: "Действия" },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Вы уверены, что хотите удалить товар?")) {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const getUnitText = (unit: number) => {
    switch (unit) {
      case 1:
        return "кг";
      case 2:
        return "шт";
      case 3:
        return "пучок";
      case 4:
        return "ящик";
      default:
        return "не указано";
    }
  };

  if (loading) {
    return <div className="container">Загрузка...</div>;
  }

  return (
    <div className={`${style.products} container`}>
      <div className={cat.categories__header}>
        <h2>Товары</h2>
        <div className={style.products__show}>
          <Link
            href="/dashboard/products/history"
            className={cat.categories__edit}
          >
            История
          </Link>
          <Link href="/dashboard/products/add" className={cat.categories__add}>
            Добавить
          </Link>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                className={
                  column.key.includes("rozn_")
                    ? style.products__rozn
                    : column.key.includes("opt_")
                    ? style.products__opt
                    : ""
                }
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((product, i) => (
              <tr key={i}>
                <td>{product.name}</td>
                <td className={style.products__opt}>{product.opt_price_min}</td>
                <td className={style.products__opt}>{product.opt_price_max}</td>
                <td className={style.products__opt}>
                  {getUnitText(product.opt_unit)}
                </td>
                <td className={style.products__rozn}>
                  {product.rozn_price_min}
                </td>
                <td className={style.products__rozn}>
                  {product.rozn_price_max}
                </td>
                <td className={style.products__rozn}>
                  {" "}
                  {getUnitText(product.rozn_unit)}
                </td>
                <td>
                  <div className={style.products__actions}>
                    <Link
                      href={`/dashboard/products/edit/${product.id}`}
                      className={cat.categories__edit}
                    >
                      Изменить
                    </Link>
                    {/* <button
                      onClick={() => handleDelete(product.id)}
                      className={cat.categories__delete}
                    >
                      Удалить
                    </button> */}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                Товары не найдены
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsPage;
