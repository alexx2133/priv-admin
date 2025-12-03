"use client";
import { useState, useEffect } from "react";
import { Setting } from "@/types/settings";
import Link from "next/link";
import style from "./contacts.module.scss";
import {
  getSettingsByGroup,
  updateMultipleSettings,
} from "@/utils/api/settingsApi";
export default function ContactsSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const data = await getSettingsByGroup("contacts");
      setSettings(data.settings);
    } catch (error) {
      alert("Ошибка загрузки настроек: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);

    try {
      const settingsToUpdate = settings.map((setting) => ({
        id: setting.id,
        data: setting.data,
      }));

      await updateMultipleSettings(settingsToUpdate);
      alert("Настройки успешно сохранены!");
    } catch (error) {
      alert("Ошибка сохранения настроек: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id: number, value: string): void => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, data: value } : setting
      )
    );
  };

  const getSettingValue = (name: string): string => {
    return settings.find((s) => s.name === name)?.data || "";
  };

  return (
    <div className={style.settings__contacts}>
      <form onSubmit={handleSave}>
        <b>Телефон в шапке</b>
        <input
          type="text"
          value={getSettingValue("contacts_top_phone")}
          onChange={(e) => handleChange(15, e.target.value)}
        />

        <b>Мобильный в шапке</b>
        <input
          type="text"
          value={getSettingValue("contacts_top_mobile")}
          onChange={(e) => handleChange(16, e.target.value)}
        />

        <b>График работы</b>
        <textarea
          value={getSettingValue("contacts_schedule")}
          onChange={(e) => handleChange(17, e.target.value)}
          rows={3}
        />

        <b>Как доехать общественным транспортом</b>
        <textarea
          value={getSettingValue("contacts_bus")}
          onChange={(e) => handleChange(18, e.target.value)}
          rows={3}
        />

        <b>Адрес</b>
        <textarea
          value={getSettingValue("contacts_address")}
          onChange={(e) => handleChange(19, e.target.value)}
          rows={2}
        />

        <b>GPS координаты</b>
        <textarea
          value={getSettingValue("contacts_gps")}
          onChange={(e) => handleChange(20, e.target.value)}
          rows={2}
        />
        <b>Телефоны</b>
        <textarea
          value={getSettingValue("contacts_phones")}
          onChange={(e) => handleChange(21, e.target.value)}
          rows={4}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
