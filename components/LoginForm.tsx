"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/utils/utils";
import { LoginCredentials } from "@/types";
import style from "./styles/login.module.scss";
export default function LoginForm() {
  const [formData, setFormData] = useState<LoginCredentials>({
    login: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData);
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard/categories");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className={style.login__bg}>
      <form onSubmit={handleSubmit} className={style.login__form}>
        <label htmlFor="login">Логин</label>
        <input
          id="login"
          name="login"
          type="text"
          required
          value={formData.login}
          onChange={handleChange}
        />

        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        {error && <div>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

    </div>
  );
}
