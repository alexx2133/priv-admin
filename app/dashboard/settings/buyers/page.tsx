"use client";
import { useState, useEffect } from "react";
import { Setting } from "@/types/settings";
import Link from "next/link";
import style from "../contacts/contacts.module.scss";
import { getSettingsByGroup, updateMultipleSettings } from "@/utils/api/settingsApi";
export default function ContactsSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const data = await getSettingsByGroup("customers_transport_number");
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
        <b>Текст перед "Карта проезда на рынок"</b>
        <textarea
          value={getSettingValue("customers_transport_number")}
          onChange={(e) => handleChange(73, e.target.value)}
          rows={4}
        />
        <button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
