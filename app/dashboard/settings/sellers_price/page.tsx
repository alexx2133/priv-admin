"use client";
import PricesForm from "@/components/PricesForm";
import { ProcessedSetting, Setting } from "@/types/settings";
import { useEffect, useState } from "react";
import style from "./sellers.module.scss";
import { getSettingsByGroup } from "@/utils/api/settingsApi";
const SellersPriceSettingsPage = () => {
  const [settingsLong, setSettingsLong] = useState<Setting[]>([]);
  const [settingsDayImport, setSettingsDayImport] = useState<Setting[]>([]);
  const [settingsDayRent, setSettingsDayRent] = useState<Setting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const dataLong = await getSettingsByGroup("sellers_long_import");
      const dataDayImport = await getSettingsByGroup("sellers_day_import");
      const dataDayRent = await getSettingsByGroup("sellers_day_rent");
      setSettingsLong(dataLong.settings);
      setSettingsDayImport(dataDayImport.settings);
      setSettingsDayRent(dataDayRent.settings);
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

  const processedSettingsLong = processSettings({
    settings: settingsLong,
    type: "sellers_long_import",
  });
  const processedSettingsDayRent = processSettings({
    settings: settingsDayRent,
    type: "sellers_day_rent",
  });
  const processedSettingsDayImport = processSettings({
    settings: settingsDayImport,
    type: "sellers_day_import",
  });
  return (
    <div>
      <div className={style.sellers__section}>
        <h1>Длительная аренда</h1>
        <h2>Тарифы на ввоз сельскохозяйственной продукции на рынок:</h2>

        {<PricesForm initSections={processedSettingsLong} />}
      </div>
      <div className={style.sellers__section}>
        <h1>Суточная аренда</h1>
        <h2>Тарифы на ввоз сельскохозяйственной продукции на рынок:</h2>

        {<PricesForm initSections={processedSettingsDayImport} />}

        <h2>Тарифы на ввоз сельскохозяйственной продукции на рынок:</h2>
        {<PricesForm initSections={processedSettingsDayRent} />}
      </div>
    </div>
  );
};

export default SellersPriceSettingsPage;
