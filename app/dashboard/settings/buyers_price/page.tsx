"use client";
import PricesForm from "@/components/PricesForm";
import { ProcessedSetting, Setting } from "@/types/settings";
import { getSettingsByGroup } from "@/utils/api/settingsApi";
import { useEffect, useState } from "react";

const SellersPriceSettingsPage = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const data = await getSettingsByGroup("customers");
      setSettings(data.settings);
    } catch (error) {
      alert("Ошибка загрузки настроек: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const processSettings = ({
    settings,
    type,
  }: {
    settings: Setting[];
    type: string;
  }) => {
    const groupedByDescription: { [key: string]: any } = {};

    settings.forEach((setting) => {
      if (!setting.description) return;

      const key = setting.description;

      if (!groupedByDescription[key]) {
        groupedByDescription[key] = { description: key };
      }

      // Определяем тип данных (data или price)
      if (setting.name.startsWith(`${type}_description_`)) {
        groupedByDescription[key].data = {
          name: setting.name,
          id: setting.id.toString(),
          info: setting.data,
        };
      } else if (setting.name.startsWith(`${type}_price_`)) {
        groupedByDescription[key].price = {
          name: setting.name,
          id: setting.id.toString(),
          info: setting.data,
        };
      }
    });

    return Object.values(groupedByDescription).filter(
      (item) => item.data && item.price
    );
  };

  const processedSettings = processSettings({
    settings: settings,
    type: "customers",
  });

  return <div>{<PricesForm initSections={processedSettings} />}</div>;
};

export default SellersPriceSettingsPage;
