"use client";
import { useState, useEffect, useRef } from "react";
import {
  getLatestProductHistory,
  getCategoryProductHistory,
  getProductHistoryByProduct,
  getProductHistoryByDate,
} from "@/utils/api/productHistoryApi";
import { getCategories } from "@/utils/api/categoryApi";
import { getProducts } from "@/utils/api/productsApi";
import { ProductHistory, Product } from "@/types/products";
import { Category } from "@/types/category";
import { Column } from "../../categories/page";
import cat from "../../categories/categories.module.scss";
import style from "./productHistory.module.scss";
import Link from "next/link";

const ProductHistoryPage = () => {
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [tempFilters, setTempFilters] = useState({
    category_id: 0,
    product_id: 0,
    exact_date: "",
  });

  const [activeFilters, setActiveFilters] = useState({
    category_id: 0,
    product_id: 0,
    exact_date: "",
  });

  const requestIdRef = useRef(0);
  const initializedRef = useRef(false);

  const columns: Column[] = [
    { key: "product_name", label: "Название" },
    { key: "opt_price_min", label: "Опт мин." },
    { key: "opt_price_max", label: "Опт макс." },
    { key: "opt_unit", label: "Опт тип." },
    { key: "rozn_price_min", label: "Розн мин." },
    { key: "rozn_price_max", label: "Розн макс." },
    { key: "rozn_unit", label: "Розн тип." },
    { key: "created", label: "Дата" },
    { key: "actions", label: "Действия" },
  ];

  // === Initial load: categories, products, filteredProducts and latest history ===
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        if (!mounted) return;

        setCategories(categoriesData.categories);
        setProducts(productsData.products);
        setFilteredProducts(productsData.products);

        // Загружаем последние данные
        const latest = await getLatestProductHistory();
        if (!mounted) return;
        setHistory(latest.history);
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        if (!mounted) return;
        setLoading(false);
        initializedRef.current = true;
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const performSearch = async () => {
    if (activeFilters.exact_date) {
      const selectedDate = new Date(activeFilters.exact_date);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        alert("Ошибка: Дата не может быть больше текущей даты");
        return;
      }
    }
    const myReqId = ++requestIdRef.current;
    setLoading(true);

    try {
      const { category_id, product_id, exact_date } = activeFilters;
      let resultHistory: ProductHistory[] = [];
      if (product_id > 0 && exact_date) {
        const data = await getProductHistoryByProduct(product_id, exact_date);
        resultHistory = data.history;
      } else if (product_id > 0) {
        const data = await getProductHistoryByProduct(product_id);
        resultHistory = data.history;
      } else if (exact_date) {
        const data = await getProductHistoryByDate(
          exact_date,
          category_id > 0 ? category_id : undefined
        );
        resultHistory = data.history;
      } else if (category_id > 0) {
        const data = await getCategoryProductHistory(category_id);
        resultHistory = data.history;
      } else {
        const data = await getLatestProductHistory();
        resultHistory = data.history;
      }

      if (myReqId !== requestIdRef.current) return;
      setHistory(resultHistory);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      if (myReqId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    if (!initializedRef.current) return;

    performSearch();
  }, [activeFilters]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const catId = Number(value);
      if (catId > 0) {
        setFilteredProducts(products.filter((p) => p.category_id === catId));
      } else {
        setFilteredProducts(products);
      }

      setTempFilters((prev) => ({
        ...prev,
        category_id: catId,
        product_id: 0, 
      }));
      return;
    }

    setTempFilters((prev) => ({
      ...prev,
      [name]: name === "product_id" ? Number(value) : value,
    }));
  };

  const handleSearch = () => {
    setActiveFilters({ ...tempFilters });
  };

  const handleReset = () => {
    setTempFilters({
      category_id: 0,
      product_id: 0,
      exact_date: "",
    });
    setFilteredProducts(products);
    setActiveFilters({
      category_id: 0,
      product_id: 0,
      exact_date: "",
    });
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  return (
    <div className={`${style.productHistory} container`}>
      <div className={cat.categories__header}>
        <h2>История цен на продукты</h2>
      </div>

      <div className={style.filters}>
        <div className={style.filterRow}>
          <div className={style.filterGroup}>
            <label htmlFor="category_id">Категория</label>
            <select
              id="category_id"
              name="category_id"
              value={tempFilters.category_id}
              onChange={handleFilterChange}
            >
              <option value={0}>Все категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={style.filterGroup}>
            <label htmlFor="product_id">Товар</label>
            <select
              id="product_id"
              name="product_id"
              value={tempFilters.product_id}
              onChange={handleFilterChange}
              disabled={!filteredProducts.length}
            >
              <option value={0}>Все товары</option>
              {filteredProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className={style.filterGroup}>
            <label htmlFor="exact_date">Дата</label>
            <input
              type="date"
              id="exact_date"
              name="exact_date"
              value={tempFilters.exact_date}
              onChange={handleFilterChange}
            />
          </div>

          <div className={style.filterActions}>
            <button
              type="button"
              onClick={handleSearch}
              className={cat.categories__add}
            >
              Поиск
            </button>

          </div>
        </div>
      </div>

      {loading && history.length === 0 ? (
        <div className="container">Загрузка...</div>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((column, i) => (
                <th key={i}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((item, i) => (
                <tr key={i}>
                  <td>{i+1}<input type="checkbox"></input></td>
                  <td> {item?.product_name}</td>
                  <td>{item.opt_price_min}</td>
                  <td>{item.opt_price_max}</td>
                  <td>{getUnitText(item.opt_unit)}</td>
                  <td>{item.rozn_price_min}</td>
                  <td>{item.rozn_price_max}</td>
                  <td>{getUnitText(item.rozn_unit)}</td>
                  <td>{formatDate(item.created)}</td>
                  <td>
                    <div className={style.productHistory__actions}>
                      <Link
                        href={`/dashboard/products/history/edit/${item.id}`}
                        className={cat.categories__edit}
                      >
                        Изменить
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} style={{ textAlign: "center" }}>
                  Записи истории не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductHistoryPage;
