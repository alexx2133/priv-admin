export interface Setting {
  id: number;
  name: string;
  data: string;
  description: string;
}

export interface SettingsResponse {
  settings: Setting[];
}

export interface UpdateSettingRequest {
  data: string;
}
export interface ProcessedSetting {
  data: {
    name: string;
    id: number;
    info: string;
  };
  price: {
    name: string;
    id: number;
    info: string;
  };
  description: string;
}
